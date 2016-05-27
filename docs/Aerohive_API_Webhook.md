# Aerohive API Webhook

## 1.0. Prerequisites
###  1.1. Account Sign Up
- Sign up for a Developer account: https://developer.aerohive.com/admin/account
- Sign up for a HiveManager (HM) account: https://cloud-va.aerohive.com/#/admin

### 1.2. API Access Tokens
Please follow the detailed instructions on [Initial Setup](https://developer.aerohive.com/docs/initial-setup) to generate an 
access token to allow you use the API.

### 1.3. Presence Web Hooks
Please review the [Presence Webhooks](https://developer.aerohive.com/docs/webhooks) page for instructions on how to set up a 
presence webhook using the access token you generated in the previous step. Specifically, you need to follow all the steps 
under the *Using the HiveManger WebApp* section.

Once the app is enabled, HiveManager will commence posting presence data to the endpoint you specified. 
#### Note 
- your HM account will likely not have actual devices to be able to receive presence data so please contact Aerohive.
- your endpoint URL must be publicly accessible on the Internet to receive presence data from HM's HTTP client.
- the app below was deployed to Heroku using an Aerohive demo account.

The request headers of presence data POSTed to your endpoint by HM's HTTP client will look like below:
```
2016-05-19T22:36:19.702737+00:00 :   headers:
2016-05-19T22:36:19.702738+00:00 :    { host: 'alive-clothing.herokuapp.com',
2016-05-19T22:36:19.702739+00:00 :      connection: 'close',
2016-05-19T22:36:19.702741+00:00 :      accept: 'text/plain, application/json, application/*+json, */*',
2016-05-19T22:36:19.702742+00:00 :      authorization: 'Basic VpVw29xZVGWqVhNHgEcpYUitt05HSsix',
2016-05-19T22:36:19.702743+00:00 :      'content-type': 'application/json',
2016-05-19T22:36:19.702749+00:00 :      'accept-charset': 'big5, big5-hkscs, ... x-windows-iso2022jp',
2016-05-19T22:36:19.702750+00:00 :      'cache-control': 'no-cache',
2016-05-19T22:36:19.702750+00:00 :      pragma: 'no-cache',
2016-05-19T22:36:19.702751+00:00 :      'user-agent': 'Java/1.7.0_80',
2016-05-19T22:36:19.702752+00:00 :      'x-request-id': '2d579ea8-1d4a-4cb3-bb2d-934f6208a7e0',
2016-05-19T22:36:19.702752+00:00 :      'x-forwarded-for': '52.0.2.51',
2016-05-19T22:36:19.702753+00:00 :      'x-forwarded-proto': 'https',
2016-05-19T22:36:19.702754+00:00 :      'x-forwarded-port': '443',
2016-05-19T22:36:19.702761+00:00 :      via: '1.1 vegur',
2016-05-19T22:36:19.702762+00:00 :      'connect-time': '1',
2016-05-19T22:36:19.702763+00:00 :      'x-request-start': '1463697379640',
2016-05-19T22:36:19.702764+00:00 :      'total-route-time': '0',
2016-05-19T22:36:19.702765+00:00 :      'content-length': '17886' },
```
