# To run this script directly, run this in an elevated admin PowerShell prompt:
#     Invoke-WebRequest -UseBasicParsing https://raw.githubusercontent.com/approvals/Approvals.NodeJS/master/install.windows.ps1 | Invoke-Expression

# This script is intended to setup a dev machine from scratch. Very useful for setting up a EC2 instance for mobbing.
#

iwr -useb https://raw.githubusercontent.com/JayBazuzi/machine-setup/main/windows.ps1 | iex
iwr -useb https://raw.githubusercontent.com/JayBazuzi/machine-setup/main/javascript-webstorm.ps1 | iex

# Clone repo
& "C:\Program Files\Git\cmd\git.exe" clone https://github.com/approvals/Approvals.NodeJS.git C:\Code\ApprovalTests.NodeJS
cd C:\Code\ApprovalTests.NodeJS
npm install
npm install -g gulp
gulp coveralls

# Done
cls
echo "Done!"
