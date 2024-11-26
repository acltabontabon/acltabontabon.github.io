---
title: "Braindump: openwealth-spring-starter"
layout: post
date: 2024-09-26 00:00
image: /assets/images/notes/n2_opensource-dev.png
tag: 
- personal-objectives
- spring-boot
- open-wealth
headerImage: false
description: "Building WealthTech Tools… One API at a Time."
category: note
notes: true
author: actabontabon
externalLink: false
---

Welcome to my next grand open-source experiment! 🎉

> **UPDATE:** Want a sneak peek at my progress? Dive into my [openwealth-starter](https://github.com/acltabontabon/openwealth-spring-starter) repo on Github and explore what’s cooking!

![Markdowm Image][0]

I’m building a Spring Boot starter to make life easier for devs like me, so we can spend more 
time doing what matters—like catching up on Netflix and playing 
[Hades II](https://store.steampowered.com/app/1145350/Hades_II/)... or maybe just sleeping. 😴

**Personal Goals:**
- Play with event driven things and native images (because why not?)
- Develop something for fun, freely—HAHA!
- Learn about wealth domain to manifest being wealthy! 💰
- Brush up on the domain knowledge I got from the marketing peepz. 🧠

> **If we share the same goals, hit me up and connect with me on GitHub!**
>
> Just a heads-up though—I only have time on weekends and nights ‘cause I’ve got a day job, and well, 
> I’m still a broke bastard trying to figure this wealth thing out. 😂

<div class="breaker"></div>

## First Milestone: Customer Management API

### Priority Features (target Dec 31, 2024, whatever fucking takes)

**1. Auto-Configuration for OpenWealth API**
   - Provide automatic configuration of API clients (RestClient? WebClient?) to access the Customer Management API.
   - Allow devs configure properties like base URLs, API keys, and authentication easily—whether programmatically or via application.properties.

**2. Customer Data Model Abstraction**
   - Create simplified domain models (DTOs) for customer data.
   - Abstract the complexity of the API responses so devs don’t have to deal with that mess.

**3. Native Image (GraalVM) Readiness**
   - Make sure the starter is GraalVM Native Image ready by using RuntimeHintsRegistrar to register classes, methods, and resources that Graal needs.

**4. KYC Workflow Automation**
   - Add helper methods or services to automate parts of the KYC process, like fetching/submitting KYC documents and validating customer data.

**5. CRUD Operations Out-of-the-Box**
   - Provide out-of-the-box services for creating, updating, deleting, and retrieving customer data—because no one likes boilerplate code.

**6. Exception Handling and Error Mapping**
   - Implement custom exception handling to translate API errors into meaningful Spring exceptions. Make it dev-friendly when things go sideways.

**7. Sample Application**
   - Ship a demo app or starter template to show how easy it is to integrate the OpenWealth Customer Management API in your Spring Boot apps.

### Ambitious Next Features (if I'm still alive and kicking)

**1. Event-Driven Integration**
   - Add support for event-driven architectures using Spring Events or pub-sub mechanisms. Trigger events when customer data changes so other components can react asynchronously.
   - Let’s mess with Kafka and JMS!

**2. Metrics and Health Checks**
   - Provide health checks and metrics for monitoring the OpenWealth API connection (e.g., response times, error rates).

**3. Caching Support**
   - Implement caching for frequently accessed customer data and give devs control over caching strategies like TTL and eviction policies.

**4. Customer Lifecycle Management (Status Tracking)**
   - Add lifecycle tracking features to make it easier for devs to check the status of customer onboarding and trigger workflows based on those changes.

**5. Custom Query Support**
   - Provide flexible querying support via a simple DSL or query builder. 
   - Let devs filter customer data based on attributes without breaking a sweat.

**6. Customizable Validations**
   - Allow developers to add custom validations before submitting customer data, using Spring’s Validator API or Bean Validation.

**7. Audit Logging**
   - Enable audit logging for all operations on customer data (create, update, delete). 
   - Provide insights into what API calls were made and what data was affected.

<div class="breaker"></div>

### References / Reading Materials
- [OpenWealth API](https://openwealth.ch)
- [Domain-Driven Design by Eric Evans](https://fabiofumarola.github.io/nosql/readingMaterial/Evans03.pdf)


[0]: /assets/images/notes/n2_opensource-dev.png
