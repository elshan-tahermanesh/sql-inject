import requests
import time
import datetime
import socket
import ipaddress
import os
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

def run_attack(target_url: str, payload: str) -> dict:
    """
    Executes a real HTTP-based SQL injection Blind SQL Injection attack check against a local/private target URL.
    This validator determines boolean-based vulnerability status based on actual HTML server responses.
    """
    logs = []
    
    logs.append("[SYSTEM] Starting remote Blind SQL Injection scan")
    logs.append(f"[TARGET] {target_url}")
    logs.append(f"[TIME] Scan initiated at {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logs.append("-" * 90)
    
    target_reachable = False
    http_request_completed = False
    blind_condition = False
    status_code = 0
    elapsed_ms = 0
    response_length = 0
    final_url = ""
    reason = ""
    
    # Helper to build the final response dict
    def make_result():
        # Append summary block
        summary = []
        summary.append("-" * 85)
        summary.append("\n[SYSTEM] Blind SQL Injection scan completed.")
        summary.append("=" * 90)
        summary.append("BLIND SQL INJECTION SUMMARY")
        summary.append("=" * 90)
        summary.append(f"Target reachable          : {'Yes' if target_reachable else 'No'}")
        summary.append(f"HTTP request completed    : {'Yes' if http_request_completed else 'No'}")
        summary.append(f"Payloads tested           : {1 if target_reachable else 0}")
        summary.append(f"TRUE conditions           : {1 if blind_condition else 0}")
        summary.append(f"FALSE conditions          : {0 if blind_condition else 1 if target_reachable else 0}")
        summary.append(f"Blind Injection detected  : {'Yes' if blind_condition else 'No'}")
        summary.append("=" * 90)
        
        full_output = "\n".join(logs) + "\n" + "\n".join(summary)
        return {
            "success": blind_condition,
            "output": full_output,
            "target_reachable": target_reachable,
            "http_request_completed": http_request_completed,
            "blind_condition": blind_condition,
            "status_code": status_code,
            "elapsed_ms": elapsed_ms,
            "response_length": response_length,
            "final_url": final_url,
            "reason": reason
        }

    # 1. Parse URL & Replace product_id parameter
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
        
        # Parse query parameters and replace product_id value
        qs = parse_qs(parsed_url.query)
        qs['product_id'] = [payload]
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
    logs.append("[PAYLOAD] Preparing Blind SQL injection...")
    logs.append(f"[PAYLOAD] Testing: {payload}")
    time.sleep(0.4)
    
    # Rebuild URL to show in logs (user-facing URL)
    display_request_url = urlunparse(new_parsed)
    logs.append("[HTTP] Dispatched GET request:")
    logs.append(f"GET {display_request_url}")
    
    # Rebuild URL to actually send to the backend (Docker-facing URL)
    actual_parsed = new_parsed._replace(netloc=f"{actual_hostname}:{port}")
    actual_request_url = urlunparse(actual_parsed)
    
    session = requests.Session()
    session.headers.update({"X-SPA-Request": "true"})
    start_time = time.time()
    try:
        response = session.get(actual_request_url, timeout=5.0, allow_redirects=True)
        http_request_completed = True
        elapsed_ms = int((time.time() - start_time) * 1000)
        status_code = response.status_code
        response_length = len(response.content)
        final_url = response.url
        if in_docker and 'host.docker.internal' in final_url:
            final_url = final_url.replace('host.docker.internal', hostname)
            
        logs.append(f"[HTTP] Status {status_code} returned in {elapsed_ms} ms.")
        size_kb = response_length / 1024.0
        logs.append(f"[RESPONSE] Page size: {size_kb:.1f} kB")
        
        if status_code >= 400:
            logs.append(f"[ERROR] Server returned error status code: {status_code}")
            logs.append("[RESULT] FAILED")
            reason = f"Server returned error status code: {status_code}"
            return make_result()
            
        # Detect Blind SQL Injection condition from HTML response
        html_body = response.text
        has_products = ('class="product-card"' in html_body) or ("class='product-card'" in html_body)
        product_not_found = "Product not found" in html_body
        
        # Boolean condition TRUE when product was returned, FALSE when no products returned or "Product not found" is shown
        if has_products and not product_not_found:
            blind_condition = True
            logs.append("[ANALYSIS] Product was returned.")
            logs.append("[ANALYSIS] Boolean condition evaluated to TRUE.")
            logs.append("[RESULT] SUCCESS! Blind SQL Injection confirmed.")
            reason = "The injected condition evaluated to TRUE."
        else:
            blind_condition = False
            logs.append("[ANALYSIS] No products were returned.")
            logs.append("[ANALYSIS] Boolean condition evaluated to FALSE.")
            logs.append("[RESULT] FAILED")
            reason = "The injected condition evaluated to FALSE."
            
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