# Contacts Web Site

## Deployed Artifacts & Status
The following functionality was implemented in API and web sites
- Register & Login - https://siteasp-mgg.azurewebsites.net/ 
- CRUD operations: Create, List, Edit, Delete Contacts - https://sitecore-mgg.azurewebsites.net/ 
- Unit tests were written for the API

## Architecture

There is MSSQL database with two tables: `USERS` and `CONTACTS`, that have a relationship

The only way reach the database is through the `ContactsApi` layer

`RequestModel` contains the models that are used to make requests and receive results from the `ContactsApi`, 
therefore is used also in the `Site Core` and `Site Asp`

![Architecture Diagram](Architecture.png)

## Source Code

- Contacts Api Source Code - https://github.com/mauriciogracia/Diceus-ContactsApi
- Site ASP Source Code - https://github.com/mauriciogracia/Diceus-SiteAsp
- Site Core Source Code - YOUR CURRENT LOCATION - https://github.com/mauriciogracia/Diceus-SiteCore

## User Documentation

To Register a new user or login you can visit - https://siteasp-mgg.azurewebsites.net/

The username must be unique

![image](https://github.com/mauriciogracia/Diceus-SiteCore/assets/2321661/8f2e08d4-eac6-41f5-b737-c9959099d5c7)

If you already have a username and password, use the login option - https://siteasp-mgg.azurewebsites.net/Account/Login

![image](https://github.com/mauriciogracia/Diceus-SiteCore/assets/2321661/ba737844-c207-489b-930f-45c59d42feb4)

Once you login you will be shown this Welcome message and be able to continue to the SiteCore website (CRUD)

![image](https://github.com/mauriciogracia/Diceus-SiteCore/assets/2321661/4c2e21d5-d2f1-4805-8273-ca550253bf87)

Once you visit https://sitecore-mgg.azurewebsites.net/ you will see the list of the existing contacts for UserId = 1 
(this is hardcoded but should be linked to the user that was logged in)

![image](https://github.com/mauriciogracia/Diceus-SiteCore/assets/2321661/3e11692d-02cc-414f-8fd8-8dade8fe53e5)

You can search contacts by email, phone or name on the fly

![image](https://github.com/mauriciogracia/Diceus-SiteCore/assets/2321661/b573ca0a-d748-493d-8b07-ff07ea4066ee)

You can edit any date of the contact

![image](https://github.com/mauriciogracia/Diceus-SiteCore/assets/2321661/cd084f21-9503-4919-8c43-aabd681f2af6)

You can add a contact

![image](https://github.com/mauriciogracia/Diceus-SiteCore/assets/2321661/33f78df5-52c6-485c-867d-3f18e6d4ab45)

Here you can see the edited and the added contact

![image](https://github.com/mauriciogracia/Diceus-SiteCore/assets/2321661/7bedd19c-b848-468c-acd4-6299ef20002b)

And here you can see that some contacts were deleted

![image](https://github.com/mauriciogracia/Diceus-SiteCore/assets/2321661/8a676df4-2315-4df2-b8b2-c32466772197)


## Token & Session sharing

The idea was to create a token when user logged into the ASP side, and bind it to the userId, and store it on the database using the ContactsApi, then to redirect to the Site Core using that token to retrieve the userId and know the contacts to show.

Once the logout happens the token will be expired/removed and will be redirected to the Site ASP to login/register

## Other improvements

The `RequestModel` should be a shared library that is deployed and reference by other projects

The API should have some security to avoid unauthorized requests

The implemented session mecachism should expire the session

The Delete contact should have a confirmation dialog to avoid accidental deletes
