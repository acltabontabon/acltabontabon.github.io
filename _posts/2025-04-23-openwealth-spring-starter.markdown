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
    - [Customer Service Usage](#customer-service-usage)
    - [Custody Service Usage](#custody-service-usage)
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

Again... trust me I'm working on it!

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
