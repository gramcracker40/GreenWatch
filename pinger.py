"""
Trying out pinging of ipv4 addresses using Python
"""

import os
from pythonping import ping

ip_list = ['138.197.101.211', '72.182.156.73', '72.182.156.74']
status_list = []
for ip in ip_list:
    # response = os.popen(f"ping {ip}", TimeoutError).read()
    
    response = ping(ip, timeout = 0.5)
    # for item in response:
    #     print(str(item) + '...\n')

    if "Reply from" in str(list(response)[0]):
        print(f"UP {ip} Ping Successful, Host is UP!")
        status_list.append(1)
    else:
        print(f"DOWN {ip} Ping Unsuccessful, Host is DOWN.")
        status_list.append(0)

print(status_list)