import requests
import time
import datetime
import socket
import ipaddress
import os
from urllib.parse import urlparse, urlunparse

def run_attack(target_url: str, payload: str, password: str = "test") -> dict:
    """
    Executes a real comment-based SQL Injection check against a local/private target login page.
    This validator determines authentication bypass status based on actual responses from the backend.
    """
    logs = []
    
    logs.append("[SYSTEM] Starting remote Comment-based SQL Injection scan")
    logs.append(f"[TARGET] {target_url}")
    logs.append(f"[TIME] Scan initiated at {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logs.append("-" * 90)
    
    target_reachable = False
    http_request_completed = False
    comment_injection = False
    status_code = 0
    elapsed_ms = 0
    response_length = 0
    redirected = False
    cookies_received = False
    final_url = ""
    reason = ""
    
    # Helper to build the final response dict
    def make_result():
        # Append summary block
        summary = []
        summary.append("-" * 85)
        summary.append("\n[SYSTEM] Comment-based SQL injection scan completed.")
        summary.append("=" * 90)
        summary.append("COMMENT INJECTION SUMMARY")
        summary.append("=" * 90)
        summary.append(f"Target reachable              : {'Yes' if target_reachable else 'No'}")
        summary.append(f"HTTP completed                : {'Yes' if http_request_completed else 'No'}")
        summary.append(f"Payloads tested               : {1 if target_reachable else 0}")
        summary.append(f"Authentication bypass         : {'Yes' if comment_injection else 'No'}")
        summary.append(f"Comment Injection successful  : {'Yes' if comment_injection else 'No'}")
        summary.append("=" * 90)
        
        full_output = "\n".join(logs) + "\n" + "\n".join(summary)
        return {
            "success": comment_injection,
            "output": full_output,
            "target_reachable": target_reachable,
            "comment_injection": comment_injection,
            "status_code": status_code,
            "elapsed_ms": elapsed_ms,
            "response_length": response_length,
            "redirected": redirected,
            "cookies_received": cookies_received,
            "final_url": final_url,
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
        
    # 6. Perform Real HTTP POST Request
    logs.append("-" * 90)
    logs.append("[PAYLOAD] Preparing comment-based injection...")
    logs.append(f"Email: {payload}")
    logs.append(f"Password: {password}")
    time.sleep(0.4)
    
    # Rebuild URL to show in logs (user-facing URL)
    display_request_url = urlunparse(parsed_url)
    logs.append("[HTTP] Dispatched POST request:")
    logs.append(f"POST {display_request_url}")
    
    # Rebuild URL to actually send to the backend (Docker-facing URL)
    actual_parsed = parsed_url._replace(netloc=f"{actual_hostname}:{port}")
    actual_request_url = urlunparse(actual_parsed)
    
    session = requests.Session()
    # Add SPA request header if targeting Golimar Store
    session.headers.update({"X-SPA-Request": "true"})
    
    form_data = {
        "email": payload,
        "password": password
    }
    
    start_time = time.time()
    try:
        # We manually check the status and handle redirects to capture details
        response = session.post(actual_request_url, data=form_data, timeout=5.0, allow_redirects=True)
        http_request_completed = True
        elapsed_ms = int((time.time() - start_time) * 1000)
        status_code = response.status_code
        response_length = len(response.content)
        
        # Check redirects history
        redirected = len(response.history) > 0
        final_url_parsed = urlparse(response.url)
        final_url = final_url_parsed.path
        if final_url_parsed.query:
            final_url += f"?{final_url_parsed.query}"
            
        # Format redirect path in logs
        if redirected:
            history_status = response.history[0].status_code
            logs.append(f"[HTTP] Status {history_status} returned in {elapsed_ms} ms.")
            logs.append(f"Redirected to: {final_url}")
        else:
            logs.append(f"[HTTP] Status {status_code} returned in {elapsed_ms} ms.")
            
        # Check cookies
        cookies_received = len(session.cookies) > 0
        
        # Detect Comment Injection bypass conditions
        html_body = response.text
        html_body_lower = html_body.lower()
        
        # Success conditions:
        # 1. Final URL is not /login
        # 2. Or cookies are received (session created)
        # 3. Or response contains Dashboard, Logout or Admin (case-insensitive)
        auth_succeeded = False
        if "/login" not in final_url:
            auth_succeeded = True
        elif cookies_received:
            auth_succeeded = True
        elif "dashboard" in html_body_lower or "logout" in html_body_lower or "admin" in html_body_lower:
            auth_succeeded = True
            
        # Failed conditions:
        # 1. Remains on /login
        # 2. Or displays invalid email or password
        rejected = "/login" in final_url or "invalid email or password" in html_body_lower
        
        if auth_succeeded and not rejected:
            comment_injection = True
            logs.append("-" * 90)
            logs.append("[ANALYSIS] The SQL comment sequence removed the password condition.")
            logs.append("[ANALYSIS] Authentication succeeded without validating the supplied password.")
            logs.append("[RESULT] SUCCESS! Comment-based SQL Injection bypassed authentication.")
            reason = "The password condition was removed using SQL comment injection."
        else:
            comment_injection = False
            logs.append("-" * 90)
            logs.append("[ANALYSIS] The login page rejected the supplied credentials.")
            logs.append("[RESULT] FAILED")
            reason = "Authentication failed."
            
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