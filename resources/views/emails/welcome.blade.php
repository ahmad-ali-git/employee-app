<!DOCTYPE html>
<html>
<head>
    <title>Welcome</title>
</head>
<body>
    <h1>Hello, {{ $user->name }}!</h1>
    <p>You have been registered as a <strong>{{ $user->role }}</strong>.</p>
    <p>Your temporary password is: <strong>password123</strong></p>
    <p>Please log in and change it immediately.</p>
</body>
</html>