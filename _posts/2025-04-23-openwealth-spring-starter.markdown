---
title: "OpenWealth Spring Starter"
layout: post
date: 2025-04-23 00:00
tag: 
- open-source
- spring-boot
- openwealth
- java
headerImage: false
projects: true
description: "Makes OpenWealth integration so easy, it’s almost suspicious."
category: project
author: actabontabon
externalLink: false
---

A lightweight and developer-friendly Spring Boot starter that simplifies integration with [OpenWealth APIs](https://openwealth.ch). It provides fluent, type-safe access to key OpenWealth services, enabling rapid development of wealth management related applications.

> **Disclaimer**  
> This project is not affiliated with or endorsed by OpenWealth or Synpulse. It is an independent effort to provide a convenient library for developers working with OpenWealth APIs.
>
> For more information about OpenWealth, visit their [official website](https://openwealth.ch).

--- 

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Setup](#setup)
    - [Maven](#maven)
    - [Gradle](#gradle)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
    - [Access Token Resolution](#access-token-resolution)
    - [Custody Service Usage](#custody-service-usage)
    - [Customer Service Usage](#customer-service-usage)
    - [Order Service Usage](#order-service-usage)
- [Development](#development)


---

## FEATURES

- **Fluent API Design:** Intuitive and readable method chaining for API interactions.
- **API Compatibility:**
  - Order Placement API `v2.0.8`
  - Customer Management API `v2.0.6`
  - Custody Services API `v2.0.3`
- **Synchronous & Asynchronous Support:** Choose between blocking and non-blocking operations.

---

## SETUP


To get started with OpenWealth Spring Starter, you need to add the dependency to your project using 
either Maven or Gradle. 

Once included, the starter provides ready-to-use service beans for interacting with OpenWealth's 
[Custody Service](https://sandbox.openwealth.synpulse8.com/docs?api=custody-services-2-0-3), [Customer Management](https://sandbox.openwealth.synpulse8.com/docs?api=customer-management-2-0-6), and [Order Placement](https://sandbox.openwealth.synpulse8.com/docs?api=order-placement-2-0-8) APIs.

### Maven
```xml
<dependency>
  <groupId>com.acltabontabon</groupId>
  <artifactId>openwealth-spring-starter</artifactId>
  <version>1.0.0-Alpha.4</version>
</dependency>
```

### Gradle
```gradle
implementation 'com.acltabontabon:openwealth-spring-starter:1.0.0-Alpha.4'
```

---

## CONFIGURATION

Trust me I'm working on it!

---

## USAGE GUIDE

### Access Token Resolution

To interact with the OpenWealth APIs, a valid access token is required for authentication.

By default, the starter uses the `StaticTokenProvider`, which reads the token from:
```yaml
openwealth:
  api:
    access-token: your-access-token
```

To customize this, you can implement your own `TokenProvider`:
```java
import com.acltabontabon.openwealth.security.TokenProvider;
import org.springframework.stereotype.Component;

@Component
public class MyCustomTokenProvider implements TokenProvider {

    @Override
    public String getAccessToken() {
        return fetchAccessTokenFromSomewhere();
    }
}
```

Once detected, your custom `TokenProvider` bean will override the default implementation automatically.

### Custody Service Usage

`CustodyService` bean is a high-level abstraction over the [Custody Services API](https://sandbox.openwealth.synpulse8.com/docs?api=custody-services-2-0-3), enabling simple and readable interaction with OpenWealth resources.

#### Retrieve customers and linked accounts
```java
import com.acltabontabon.openwealth.commons.Result;
import com.acltabontabon.openwealth.models.custodyservices.Customer;
import com.acltabontabon.openwealth.properties.OpenWealthApiProperties.CustodyServices;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustodyExample {

    private final CustodyService custodyService;

    public void listCustomers() {
        Result<List<Customer>> result = custodyService
            .customers()
            .withCorrelationId("1234")
            .fetch();

        result.getData().forEach(customer -> {
            log.info("Customer ID: {}", customer.getCustomerIdentification());
            log.info("Accounts: {}", customer.getAccountInformationList().size());
        });
    }
}
```

This corresponds to:

```
GET <custodyServices_baseUrl>/customers
```


---

## DEVELOPMENT

To build the project locally:

```bash
## Clone the repository
git clone https://github.com/acltabontabon/openwealth-spring-starter.git

## Navigate to the project directory
cd openwealth-spring-starter

## Build the project
./gradlew build
```

To contribute, please check the [contributing guide](https://github.com/acltabontabon/openwealth-spring-starter/blob/master/CONTRIBUTING.md).
