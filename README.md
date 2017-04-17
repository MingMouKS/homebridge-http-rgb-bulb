# homebridge-http-rgb-bulb

Supports HTTP/HTTPS devices on Homebridge Platform. This plugin requires/uses a simple interface with the enpoint (only a set color URI and a get color URI). I decided to create my own RGB plugin after try to use [homebridge-better-http-rgb](https://www.npmjs.com/package/homebridge-better-http-rgb) and [homebridge-http-rgb](https://www.npmjs.com/package/homebridge-http-rgb) without good results due to the complex interfaces and concurrency problems/bugs.

# Installation

1. Follow the instruction in [homebridge](https://www.npmjs.com/package/homebridge) for the homebridge server installation.

2. The plugin is published through [NPM](https://www.npmjs.com/package/homebridge-http-rgb-bulb) and should be installed "globally" by typing: `npm install -g homebridge-http-rgb-bulb`

3. Update your configuration file. See [config-sample.json](https://github.com/metbosch/homebridge-http-rgb-bulb/blob/master/config-sample.json) in this repository for a sample.

# Configuration

Example:

```bash
{
  "accessory": "HttpRGB",
  "name": "RGB Bulb",
  "set_url": "http://192.168.1.100/rgb?color=0x%s",
  "get_url": "http://192.168.1.100/rgb?format=hex",
  "http_method": "GET"
}
```

The mandatory options are:
 * ```name``` Accessory name.
 * ```set_url``` Endpoint to call with the requested color. The module replaces the '%s' characters with the hexadecimal code value.
 * ```get_url``` Endpoint to request the current state. The response must be plain text with the hexadecimal color code (without any simbol like '0x' or '#' at the begining).

The other available options are:
 * ```manufacter``` Manufacter name to be displayed.
 * ```model``` Model name to be displayed.
 * ```serial``` Serial number to be displayed.
 * ```http_method``` Http metod that will be used to call the ```url``` when the state is requested. Default is 'GET' (check request module to get the available options).
 * ```timeout``` Miliseconds to wait for the accessory response before send an error. Default is '5000 ms'.
