import requests
import time
import datetime
import socket
import ipaddress
import os
from urllib.parse import urlparse

def run_attack(target_url: str, payload: str) -> dict:
    """
    Executes a real HTTP-based SQL injection UNION attack check against a local/private target URL.
    This validator determines vulnerability status based on actual server responses.
    """
    logs = []
    
    logs.append("[SYSTEM] Starting remote UNION SQL injection scan")
    logs.append(f"[TARGET] {target_url}")
    logs.append(f"[TIME] Scan initiated at {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logs.append("-" * 90)
    
    target_reachable = False
    http_request_completed = False
    union_leak_detected = False
    status_code = 0
    elapsed_ms = 0
    response_length = 0
    final_url = ""
    total_rows = 0
    leaked_rows_count = 0
    executed_query = ""
    leaked_rows = []
    reason = ""
    
    # Helper to build the final response dict
    def make_result():
        # Append summary block
        summary = []
        summary.append("-" * 85)
        summary.append("\n[SYSTEM] UNION SQL injection scan completed.")
        summary.append("=" * 90)
        summary.append("UNION SQL INJECTION SUMMARY")
        summary.append("=" * 90)
        summary.append(f"Target reachable          : {'Yes' if target_reachable else 'No'}")
        summary.append(f"HTTP request completed    : {'Yes' if http_request_completed else 'No'}")
        summary.append(f"Payloads tested           : {1 if target_reachable else 0}")
        summary.append(f"Successful injections     : {1 if union_leak_detected else 0}")
        summary.append(f"Success rate              : {'100%' if union_leak_detected else '0%'}")
        summary.append(f"Total rows returned       : {total_rows}")
        summary.append(f"Leaked user records       : {leaked_rows_count}")
        summary.append(f"UNION data leak detected  : {'Yes' if union_leak_detected else 'No'}")
        summary.append("=" * 90)
        
        full_output = "\n".join(logs) + "\n" + "\n".join(summary)
        return {
            "success": union_leak_detected,
            "output": full_output,
            "target_reachable": target_reachable,
            "http_request_completed": http_request_completed,
            "union_leak_detected": union_leak_detected,
            "status_code": status_code,
            "elapsed_ms": elapsed_ms,
            "response_length": response_length,
            "final_url": final_url,
            "total_rows": total_rows,
            "leaked_rows_count": leaked_rows_count,
            "executed_query": executed_query,
            "leaked_rows": leaked_rows,
            "reason": reason
        }

    # 1. Parse URL
    try:
        parsed_url = urlparse(target_url)
        scheme = parsed_url.scheme
        if not scheme:
            temp_url = target_url
            if not temp_url.startswith("http"):
                temp_url = "http://" + temp_url
            parsed_url = urlparse(temp_url)
            scheme = parsed_url.scheme or "http"
            
        hostname = parsed_url.hostname
        if not hostname:
            raise ValueError("Hostname could not be parsed.")
            
        port = parsed_url.port
        if not port:
            port = 443 if scheme == "https" else 80
            
        path = parsed_url.path or "/"
        query = parsed_url.query
    except Exception as e:
        logs.append("[ERROR] Invalid URL format.")
        logs.append("[RESULT] FAILED")
        logs.append("[SYSTEM] Scan terminated.")
        reason = "Invalid URL format."
        return make_result()
        
    logs.append(f"Host: {hostname}")
    logs.append(f"Port: {port}")
    logs.append(f"Path: {path}")
    
    # 2. Docker check & translation
    in_docker = os.path.exists('/.dockerenv') or (os.path.exists('/proc/self/cgroup') and any('docker' in line for line in open('/proc/self/cgroup', 'rt', errors='ignore')))
    
    actual_hostname = hostname
    if in_docker and hostname in ['localhost', '127.0.0.1', '::1']:
        actual_hostname = 'host.docker.internal'
        
    # 3. DNS Resolution
    logs.append(f"[DNS] Resolving hostname '{hostname}'...")
    time.sleep(0.4)
    
    resolved_ip = None
    try:
        resolved_ip = socket.gethostbyname(actual_hostname)
        logs.append(f"[DNS] Resolved hostname to server IP: {resolved_ip}")
    except socket.gaierror as e:
        logs.append(f"[ERROR] DNS resolution failed for hostname '{hostname}': {str(e)}")
        logs.append("[RESULT] FAILED")
        logs.append("[SYSTEM] Scan terminated.")
        reason = f"DNS resolution failed for hostname '{hostname}'"
        return make_result()
        
    # 4. Local-lab safety check
    is_safe = False
    if actual_hostname == 'host.docker.internal':
        is_safe = True
    else:
        try:
            ip_obj = ipaddress.ip_address(resolved_ip)
            if ip_obj.is_loopback or ip_obj.is_private:
                is_safe = True
        except ValueError:
            pass
            
    if not is_safe:
        logs.append("[ERROR] Target IP address is not on a local or private network.")
        logs.append("[ERROR] Scanning of public internet targets is disabled for safety.")
        logs.append("[RESULT] FAILED")
        logs.append("[SYSTEM] Scan terminated.")
        reason = "Scanning of public internet targets is disabled for safety."
        return make_result()
        
    # 5. TCP Connection check
    logs.append(f"[CONNECT] Initializing TCP connection with {hostname}:{port}...")
    time.sleep(0.4)
    
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(3.0)
        s.connect((resolved_ip, port))
        s.close()
        target_reachable = True
        logs.append("[CONNECT] Connection successfully established.")
    except Exception as e:
        logs.append("[CONNECT] Connection failed.")
        logs.append(f"[ERROR] Connection refused by the target server.")
        logs.append("[RESULT] FAILED")
        reason = "Connection refused by the target server."
        return make_result()
        
    # 6. Perform Real HTTP GET Request
    logs.append("-" * 90)
    logs.append("[PAYLOAD] Preparing UNION-based extraction payload...")
    logs.append(f"[PAYLOAD] Testing: {payload}")
    time.sleep(0.4)
    
    # We display the original URL to the user in the logs
    display_request_url = f"{scheme}://{hostname}:{port}{path}?q={payload}"
    logs.append("[HTTP] Dispatched GET request:")
    logs.append(f"GET {display_request_url}")
    
    # We execute against the translated actual target
    actual_url = f"{scheme}://{actual_hostname}:{port}{path}"
    
    session = requests.Session()
    start_time = time.time()
    try:
        response = session.get(actual_url, params={"q": payload}, timeout=5.0, allow_redirects=True)
        http_request_completed = True
        elapsed_ms = int((time.time() - start_time) * 1000)
        status_code = response.status_code
        response_length = len(response.content)
        final_url = response.url
        if in_docker and 'host.docker.internal' in final_url:
            final_url = final_url.replace('host.docker.internal', hostname)
            
        logs.append(f"[HTTP] Status {status_code} returned in {elapsed_ms} ms.")
        size_kb = response_length / 1024.0
        logs.append(f"[RESPONSE] Response body length: {size_kb:.1f} kB")
        
        if status_code >= 400:
            logs.append(f"[ERROR] Server returned error status code: {status_code}")
            logs.append("[RESULT] FAILED")
            reason = f"Server returned error status code: {status_code}"
            return make_result()
            
        # Parse JSON response
        try:
            res_json = response.json()
        except ValueError:
            logs.append("[ERROR] Response is not a valid JSON document.")
            logs.append("[RESULT] FAILED")
            reason = "Response is not a valid JSON document."
            return make_result()
            
        # Check success key
        success_status = res_json.get("success", False)
        executed_query = res_json.get("executed_query", "")
        
        if not success_status:
            error_msg = res_json.get("error", "Vulnerable search returned success=false")
            logs.append(f"[ERROR] Query error returned by target: {error_msg}")
            logs.append("[RESULT] FAILED")
            reason = f"Query error returned by target: {error_msg}"
            return make_result()
            
        # Check products structure
        products = res_json.get("products", [])
        if not isinstance(products, list):
            logs.append("[ERROR] Unexpected response schema (products is not an array).")
            logs.append("[RESULT] FAILED")
            reason = "Unexpected response schema."
            return make_result()
            
        total_rows = len(products)
        logs.append(f"[RESPONSE] Total returned rows: {total_rows}")
        
        # Look for user-record rows
        for prod in products:
            if prod.get("slug") == "user-record":
                leaked_rows.append({
                    "id": prod.get("id"),
                    "email": prod.get("name"),
                    "password_hash": prod.get("description"),
                    "is_admin": True if prod.get("stock") == 1 else False
                })
                
        leaked_rows_count = len(leaked_rows)
        
        if leaked_rows_count > 0:
            union_leak_detected = True
            logs.append(f"[ANALYSIS] Found {leaked_rows_count} rows marked as user-record.")
            logs.append("[ANALYSIS] User-table records were merged into the product result set.")
            logs.append("[RESULT] SUCCESS! UNION-based data leakage detected.")
            reason = f"{leaked_rows_count} user records were returned through the UNION query."
        else:
            union_leak_detected = False
            logs.append("[ANALYSIS] No user-record rows were found in the response.")
            logs.append("[RESULT] FAILED")
            reason = "No user-record rows were found in the real response."
            
    except requests.exceptions.Timeout:
        logs.append("[ERROR] Request timed out (5s).")
        logs.append("[RESULT] FAILED")
        reason = "Request timed out."
    except requests.exceptions.SSLError as e:
        logs.append(f"[ERROR] SSL Error: {str(e)}")
        logs.append("[RESULT] FAILED")
        reason = "SSL validation failed."
    except requests.exceptions.RequestException as e:
        logs.append(f"[ERROR] HTTP request failed: {str(e)}")
        logs.append("[RESULT] FAILED")
        reason = "HTTP request failed."
        
    return make_result()