---
title: "ISALIN"
layout: post
date: 2023-11-04 00:00
tag: 
- open-source
- spring-boot
- google-translate
- java
headerImage: false
projects: true
description: "A Spring Boot library for a streamlined Google Translate API usage."
category: project
author: actabontabon
externalLink: false
---

This Spring Boot library simplifies and streamlines the usage of the Google Translate API, reducing
boilerplate code and providing a more convenient integration.

![isalin-version](https://img.shields.io/badge/version-1.0.2-blue)
![isalin-java-comp](https://img.shields.io/badge/java-17%2B-blue)
![isalin-spring-comp](https://img.shields.io/badge/spring--boot-3.x-blue)
![isalin-license](https://img.shields.io/github/license/acltabontabon/isalin)
[![CodeQL](https://github.com/acltabontabon/isalin/actions/workflows/codeql.yml/badge.svg)](https://github.com/acltabontabon/isalin/actions/workflows/codeql.yml)
[![Dependency Review](https://github.com/acltabontabon/isalin/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/acltabontabon/isalin/actions/workflows/dependency-review.yml)

## FEATURES
- Text translation
- Document translation
- Provides `@Translate` annotation to translate the response of a method
- Provides spring bean named `IsalinService` for in-line usage
- Supported all languages listed [here](https://cloud.google.com/translate/docs/languages)
- Works with Google SDK V3

---

## SETUP

To start using Isalin library, you need to setup first your [Google Authentication credentials](https://cloud.google.com/docs/authentication/provide-credentials-adc).

#### Apache Maven
```xml
<dependency>
    <groupId>com.acltabontabon</groupId>
    <artifactId>isalin</artifactId>
    <version>1.0.2</version>
</dependency>
```

#### Gradle
```
implementation group: 'com.acltabontabon', name: 'isalin', version: '1.0.2'
```

---

## USAGE

#### Single text translation
```java
@Translate(from = Language.ENGLISH, to = Language.FILIPINO)
public String getGreetings() {
  return "Hello world!";
}
```

#### Single text translation with auto detection of source language
```java
@Translate(to = Language.FILIPINO)
public String getGreeting() {
  return "Hello world!";
}
```

#### Single text translation within a custom object
```java
@Translate(value = "$.body.content", from = Language.ENGLISH, to = Language.FILIPINO)
public CustomMessage getGreeting() {
  CustomMessage msg = new CustomMessage();
  msg.setSource("Tarzan");
  msg.setBody(new Content("Welcome to the jungle!"));

  return msg;
}
```

#### Multiple text translation
```java
@Translate(from = Language.ENGLISH, to = Language.FILIPINO)
public List<String> getGreetings() {
  return List.of("Hello!", "Hi");
}
```

#### Single file translation
```java
@Translate(from = Language.ENGLISH, to = Language.FILIPINO)
public File getDocument() {
  return new File("/path/to/my/file.pdf");
}
```

> **Note**
> Supported file formats: `.doc`, `.docx`, `.pdf`, `.ppt`, `.pptx`, `.xls`, `.xlsx`

#### Multiple file translation
```java
@Translate(from = Language.ENGLISH, to = Language.FILIPINO)
public List<File> getDocuments() {
  return List.of(new File("/path/to/my/file.pdf"), new File("/path/to/my/file2.pdf"));
}
```


#### Inline translation
```java
@Autowired
private IsalinService isalinService;
    
private void translate() {
  String text  = isalinService.translateText("Hello", Language.ENGLISH, Language.FILIPINO);
  List<String> texts  = isalinService.translateTexts(List.of("Hi","Hello"), Language.ENGLISH, Language.FILIPINO);
  
  File doc  = isalinService.translateDocument("/path/to/my/file.pdf", Language.ENGLISH, Language.FILIPINO);
  List<File> docs  = isalinService.translateDocuments(List.of("/path/file.ppt","/path/file.pdf"), Language.ENGLISH, Language.FILIPINO);
  
  // auto detection of source language
  String text2  = isalinService.translateText("Hello", Language.ANY, Language.FILIPINO);
  File doc2  = isalinService.translateDocument("/path/to/my/file.pdf", Language.ANY, Language.FILIPINO);
}
 ```

<div class="breaker"></div>

## Request / Issues
If you have feature requests or encounter any issues, please [open a ticket](https://github.com/acltabontabon/isalin/issues/new).
