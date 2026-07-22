import requests
import time
import datetime
import socket
import ipaddress
import os
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

def run_attack(target_url: str, payload: str) -> dict:
    """
    Executes a safe, non-destructive stacked-query capability check.
    It verifies if stacked queries are accepted without deleting any tables.
    """
    logs = []
    
    logs.append("[SYSTEM] Starting non-destructive DROP TABLE vulnerability check")
    logs.append(f"[TARGET] {target_url}")
    logs.append(f"[TIME] Scan initiated at {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logs.append("-" * 90)
    
    target_reachable = False
    http_request_completed = False
    vulnerability_detected = False
    stacked_queries_possible = False
    destructive_statement_executed = False
    table_exists_before = True
    table_exists_after = True
    table_name = "products"
    status_code = 0
    elapsed_ms = 0
    response_length = 0
    reason = ""
    
    # Helper to build the final response dict
    def make_result():
        # Append summary block
        summary = []
        summary.append("-" * 85)
        summary.append("\n[SYSTEM] DROP TABLE vulnerability check completed.")
        summary.append("=" * 90)
        summary.append("DROP TABLE VULNERABILITY CHECK SUMMARY")
        summary.append("=" * 90)
        summary.append(f"Target reachable              : {'Yes' if target_reachable else 'No'}")
        summary.append(f"HTTP request completed        : {'Yes' if http_request_completed else 'No'}")
        summary.append(f"Payload sample                : {payload}")
        summary.append(f"Destructive payload dispatched: No")
        summary.append(f"Stacked queries possible      : {'Yes' if stacked_queries_possible else 'No'}")
        summary.append(f"Products table before check   : {'Present' if table_exists_before else 'Absent'}")
        summary.append(f"Products table after check    : {'Present' if table_exists_after else 'Absent'}")
        summary.append(f"Database modified             : {'Yes' if destructive_statement_executed else 'No'}")
        summary.append(f"Vulnerability detected        : {'Yes' if vulnerability_detected else 'No'}")
        summary.append("=" * 90)
        
        full_output = "\n".join(logs) + "\n" + "\n".join(summary)
        return {
            "success": vulnerability_detected,
            "output": full_output,
            "target_reachable": target_reachable,
            "vulnerability_detected": vulnerability_detected,
            "stacked_queries_possible": stacked_queries_possible,
            "destructive_statement_executed": destructive_statement_executed,
            "table_exists_before": table_exists_before,
            "table_exists_after": table_exists_after,
            "table_dropped": not table_exists_after,
            "table_name": table_name,
            "status_code": status_code,
            "elapsed_ms": elapsed_ms,
            "response_length": response_length,
            "reason": reason
        }

    # 1. Parse URL & configure GET parameter id
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
        
        # Build safe query parameters probe (1'; SELECT 1; --)
        qs = parse_qs(parsed_url.query)
        qs['id'] = ["1'; SELECT 1; --"]
        new_query = urlencode(qs, doseq=True)
        new_parsed = parsed_url._replace(query=new_query)
        
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
    in_docker = os.path.exists('//.dockerenv') or (os.path.exists('/proc/self/cgroup') and any('docker' in line for line in open('/proc/self/cgroup', 'rt', errors='ignore')))
    
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
        
    # 6. Safety logs block
    logs.append("-" * 90)
    logs.append(f"[PAYLOAD SAMPLE] {payload}")
    logs.append("[SAFETY] Destructive execution disabled.")
    logs.append("The displayed payload will not be dispatched.")
    logs.append("-" * 90)
    
    session = requests.Session()
    
    # 7. Pre-verification check
    verify_path = path.rstrip('/') + "/status"
    verify_parsed = new_parsed._replace(path=verify_path, query="")
    verify_url = urlunparse(verify_parsed._replace(netloc=f"{actual_hostname}:{port}"))
    
    logs.append("[CHECK] Verifying database state before probe...")
    try:
        pre_res = session.get(verify_url, timeout=3.0)
        pre_json = pre_res.json()
        table_exists_before = pre_json.get("table_exists", True)
    except Exception as e:
        logs.append(f"[ERROR] Failed to query table status before probe: {str(e)}")
        logs.append("[RESULT] FAILED")
        reason = "Verification endpoint unavailable."
        return make_result()
        
    # 8. Dispatch harmless stacked query probe
    logs.append("[CHECK] Sending a harmless stacked-query capability probe...")
    
    # Rebuild URL to show in logs (user-facing URL)
    display_request_url = urlunparse(new_parsed)
    logs.append("[HTTP] Dispatched GET request:")
    logs.append(f"GET {display_request_url}")
    
    # Rebuild URL to actually send to the backend (Docker-facing URL)
    actual_parsed = new_parsed._replace(netloc=f"{actual_hostname}:{port}")
    actual_request_url = urlunparse(actual_parsed)
    
    start_time = time.time()
    try:
        response = session.get(actual_request_url, timeout=5.0, allow_redirects=True)
        http_request_completed = True
        elapsed_ms = int((time.time() - start_time) * 1000)
        status_code = response.status_code
        response_length = len(response.content)
        
        logs.append(f"[HTTP] Status {status_code} returned in {elapsed_ms} ms.")
        
        # Parse JSON response
        try:
            res_json = response.json()
            probe_success = res_json.get("success", False)
        except ValueError:
            logs.append("[ERROR] Response is not a valid JSON document.")
            logs.append("[RESULT] FAILED")
            reason = "Response is not a valid JSON document."
            return make_result()
            
        if status_code >= 400 or not probe_success:
            logs.append(f"[ERROR] Server returned error status code: {status_code}")
            logs.append("[RESULT] FAILED")
            reason = f"Server returned error status code: {status_code}"
            return make_result()
            
        stacked_queries_possible = True
        
        # 9. Post-verification check
        logs.append("-" * 90)
        logs.append("[CHECK] Verifying database state after probe...")
        time.sleep(0.4)
        
        try:
            post_res = session.get(verify_url, timeout=3.0)
            post_json = post_res.json()
            table_exists_after = post_json.get("table_exists", True)
        except Exception as e:
            logs.append(f"[ERROR] Failed to query table status after probe: {str(e)}")
            logs.append("[RESULT] FAILED")
            reason = "Verification endpoint unavailable."
            return make_result()
            
        # 10. Analyze Safety & Success
        logs.append("-" * 90)
        logs.append(f"[VERIFY] Products table before check: {'Present' if table_exists_before else 'Absent'}")
        logs.append(f"[VERIFY] Products table after check: {'Present' if table_exists_after else 'Absent'}")
        
        if table_exists_before and not table_exists_after:
            destructive_statement_executed = True
            vulnerability_detected = False
            logs.append("[SAFETY] Unexpected database modification detected.")
            logs.append("[RESULT] FAILED")
            reason = "Unexpected database modification detected."
        elif stacked_queries_possible and table_exists_after:
            vulnerability_detected = True
            logs.append("[ANALYSIS] The endpoint accepted a non-destructive multi-statement probe.")
            logs.append("[RESULT] VULNERABLE")
            logs.append("\nStacked-query SQL Injection appears possible.")
            logs.append("No database table was modified or deleted.")
            reason = "A non-destructive probe confirmed a multi-statement-capable SQL execution path."
        else:
            vulnerability_detected = False
            logs.append("[ANALYSIS] The endpoint rejected the harmless multi-statement probe.")
            logs.append("[RESULT] NOT CONFIRMED")
            reason = "The endpoint rejected the harmless stacked-query probe."
            
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