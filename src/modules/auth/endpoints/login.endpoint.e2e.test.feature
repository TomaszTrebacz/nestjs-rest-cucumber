Feature: Login a user -> #post /auth/login

    Scenario: Email is not found
        Given email which does not exist in database
        Then API throws error that email was not found

    Rule: Database should be seeded with random data before each test
        Background:
            Given random user is created in database

        Scenario: Password is invalid
            When password is different from the one in database
            Then API throws error that password is invalid

        Scenario: Login is successful
            When credentials are valid
            Then API should return status 201
            And API should return user with token
