#!/bin/bash

set -ue

# Redirect /var/log/user-data.log and /dev/console
exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1

# Setting squid
dnf install -y squid
systemctl enable --now squid