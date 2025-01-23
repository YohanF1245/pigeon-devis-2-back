# NestJS vs Spring Framework

## 1.1 Criteria

| Criteria                | NestJS                                      | Spring Framework                                             |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------------ |
| Framework Type          | Node.js, based on JavaScript and TypeScript | Java, based on Java language                                 |
| Architecture            | Modular, extensible                         | Based on annotations and XML                                 |
| Multi-threading Support | Not supported                               | Supported                                                    |
| Memory Usage            | Low memory usage                            | Higher memory usage                                          |
| Performance             | Ideal for I/O tasks                         | Better for computation-heavy applications                    |
| Community               | Fast-growing JavaScript community           | Well-established Java community                              |
| Ease of Use             | Easy to use, powerful CLI                   | May require more configuration                               |
| Dependency              | Built-in dependency injection               | Dependency injection via annotations                         |
| Use Cases               | Applications requiring rapid scalability    | Enterprise applications with high computational requirements |

## 1.2 Advantages and Disadvantages

| Framework | Advantages | Disadvantages |
|-------------|---------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| NestJS | - Light and fast<br>- Ideal for I/O tasks<br>- TypeScript usage | - Lack of multi-threading support<br>- Not ideal for heavy computations |
| Spring | - Supports multi-threading<br>- Statically typed<br>- Large plugin ecosystem | - High memory usage<br>- May include unused dependencies |

## 1.3 Examples of Companies Using Each Framework

| NestJS Companies | Spring Framework Companies |
|--------------------------|------------------------------------|
| Adidas | Intuit |
| Capgemini | Zalando |
| Decathlon | Accenture |
| Autodesk | Zillow |
| Société Générale | Indeed |
| Neo4j | Picnic Engineering |
| | Google |
| | Microsoft |
| | Capital One |
| | Amazon |

## 2. Technical Head to Head

### 2.1 Time for 1 Million Requests

|                            | nestjs        | spring boot   |
| -------------------------- | ------------- | ------------- |
| 10 concurrent connections  | 134.5 seconds | 114.6 seconds |
| 50 concurrent connections  | 135.2 seconds | 119.9 seconds |
| 100 concurrent connections | 137.5 seconds | 120.5 seconds |

## 2.2 Requests per Second

|                            | nestjs | spring boot |
| -------------------------- | ------ | ----------- |
| 10 concurrent connections  | 7436   | 8729        |
| 50 concurrent connections  | 7398   | 8627        |
| 100 concurrent connections | 7271   | 8296        |

## 2.3 Median Latency (ms)

|                            | nestjs | spring boot |
| -------------------------- | ------ | ----------- |
| 10 concurrent connections  | 1.35   | 1.08        |
| 50 concurrent connections  | 6.37   | 5.27        |
| 100 concurrent connections | 13.67  | 11.18       |

## 2.4 Average CPU Usage (%)

|                            | nestjs | spring boot |
| -------------------------- | ------ | ----------- |
| 10 concurrent connections  | 102    | 302         |
| 50 concurrent connections  | 103    | 308         |
| 100 concurrent connections | 105    | 374         |

## 2.5 Average Memory Usage (MB)

|                            | nestjs | spring boot |
| -------------------------- | ------ | ----------- |
| 10 concurrent connections  | 190    | 527         |
| 50 concurrent connections  | 191    | 573         |
| 100 concurrent connections | 194    | 623         |

## 3.1 Security

| Criteria                | NestJS                                                                                            | Spring Boot                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Authentication         | Uses libraries like Passport for authentication management. Supports JWT, OAuth, etc.              | Easy integration with Spring Security for authentication and authorization. Supports JWT, OAuth, SAML, etc.                |
| Authorization          | Manages roles and permissions through guards and decorators.                                      | Uses annotations and configurations to manage roles and permissions.                                                      |
| CSRF Protection        | No default CSRF protection, but can be implemented via middleware.                                | Built-in CSRF protection for web applications.                                                                           |
| API Security           | Can be secured via middleware and guards.                                                         | API security through Spring Security, with detailed configurations.                                                       |
| Input Validation       | Uses pipes to validate and transform input data.                                                  | Uses validation annotations (like @Valid) to validate inputs.                                                            |
| Error Handling         | Can be handled via exception filters.                                                             | Error handling through exception controllers and custom responses.                                                        |
| Encryption             | Supports data encryption but requires external libraries.                                         | Supports data encryption with built-in configurations.                                                                   |
| Audit and Logging      | Can be implemented via middleware or custom services.                                             | Integration with logging frameworks like Logback and SLF4J for auditing.                                                 |
## 4 Conclusion

Based on our comparative analysis, both frameworks have their distinct advantages:

- **Spring Framework** excels in enterprise-level applications requiring robust security, extensive computational capabilities, and comprehensive documentation. It's particularly well-suited for large-scale applications with complex business logic and strict security requirements.

- **NestJS** shines in scenarios requiring rapid development, lightweight implementation, and excellent I/O performance. It's ideal for modern web applications and microservices where quick scalability and lower resource consumption are priorities.

Given that this is a basic CRUD application with a login system developed by a single developer with Java experience, Spring Boot becomes a more attractive choice for these reasons:
- Leveraging existing Java knowledge reduces the learning curve significantly
- Built-in robust security features crucial for handling business documents
- Extensive documentation and mature ecosystem
- Strong type safety and better error handling out of the box
- Familiar development patterns and tools
- Future-proof choice: easier to scale vertically by deploying to a more powerful VPS if the application succeeds, rather than facing a potential technical debt of migrating from NestJS to Spring later

While NestJS offers lighter resource consumption and faster initial setup, the advantage of prior Java experience makes Spring Boot's learning curve less steep. The built-in security features and familiar development environment would likely lead to more confident and secure development, especially for business-critical documents like quotes and invoices.

# Sources
[Benchmarks](https://medium.com/deno-the-complete-reference/nestjs-vs-springboot-performance-comparison-for-jwt-verify-and-mysql-query-731c6a3ce16)
[Comparison](https://selleo.com/blog/nestjs-vs-spring-framework-in-java-which-should-i-choose)