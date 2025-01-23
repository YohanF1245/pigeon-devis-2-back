# Contributing Guidelines

## Commit Convention

All commits must follow this format:
```
type(scope): subject (50 chars max)

Body of the message if needed:
- detail 1
- detail 2
```

### Rules
1. **One File Per Commit**: Each commit should modify only one file
   - One commit = One file change
   - Exception: tightly coupled files (e.g., DTO + Test)
   - Split multiple file changes into separate commits

2. **Language**: All commits MUST be written in English

3. **Atomic Commits**: Each commit should represent a single logical change
   - Do one thing only
   - Don't mix different concerns (e.g. don't fix a bug and add a feature in the same commit)
   - Should be able to be reverted without affecting other changes
   - Example: updating both SQL schema and data dictionary for the same change is ONE logical change

4. **Type**: Must be one of:
   - `build`: Changes to build system or dependencies
   - `ci`: Changes to CI configuration files and scripts
   - `docs`: Documentation only changes
   - `feat`: A new feature
   - `fix`: A bug fix
   - `perf`: A code change that improves performance
   - `refactor`: A code change that neither fixes a bug nor adds a feature
   - `style`: Changes that do not affect the meaning of the code
   - `test`: Adding missing tests or correcting existing tests

5. **Scope**: Usually the filename with extension (e.g., `data-dictionary.md`)

6. **Subject**: 
   - Maximum 50 characters
   - Written in English
   - Use imperative mood ("add" not "added" or "adds")
   - No period at the end
7 **Cursor Rules**:
   - try to put max amount of commands in single run command

### Examples
Good commits:
```
docs(data-dictionary.md): update business rules
feat(user.service.ts): add email verification
fix(auth.guard.ts): resolve token expiration issue
```

Bad commits:
```
updated file                    # Missing type and scope
feat: added new stuff          # Missing scope, too vague
docs(CONTRIBUTING): added...    # Using past tense
fix(many-files): various fixes # Not atomic, too many changes
``` 