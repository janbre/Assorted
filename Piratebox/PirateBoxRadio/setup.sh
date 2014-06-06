#!/bin/sh
echo "Adding group icecast to /etc/group"
echo "icecast:x:200:" >> /etc/group
echo "Adding user icecast to /etc/passwd"
echo "icecast:*:200:200:icecast:/mnt/usb:/bin/ash" >> /etc/passwd
echo "Installing required packages"
opkg install -d ext packages/*
echo "Just ignore the error message above"
