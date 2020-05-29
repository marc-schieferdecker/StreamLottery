# Install the certificate with mkcert

To have a valid SSL certificate for your localhost, open PowerShell and run the following commands to install the SSL certificate to your computer:

```
cd <Installation Path>\bin\certstore
.\mkcert.exe localhost
.\mkcert.exe -install
```

Dismiss the dialog, then close and reopen your browser.

Open `https://localhost`, the SSL certificate should now be valid.

## More information

If you are not on Windows, you can find mkcert for your OS here:

[https://github.com/FiloSottile/mkcert](https://github.com/FiloSottile/mkcert)