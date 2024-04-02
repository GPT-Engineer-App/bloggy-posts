import { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Input, Stack, Container, useToast } from "@chakra-ui/react";
import { FaSignInAlt, FaSignOutAlt, FaPlus } from "react-icons/fa";

const API_URL = "https://backengine-ui7g.fly.dev";

const Index = () => {
  const [posts, setPosts] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        setIsLoggedIn(true);
        toast({
          title: "Login Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Login Failed",
          description: errorData.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast({
          title: "Signup Successful",
          description: "You can now log in.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Signup Failed",
          description: errorData.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleLogout = () => {
    setAccessToken("");
    setIsLoggedIn(false);
    toast({
      title: "Logged Out",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" py={8}>
      <Heading as="h1" size="xl" mb={8}>
        Blog Post App
      </Heading>

      {isLoggedIn ? (
        <>
          <Button leftIcon={<FaSignOutAlt />} colorScheme="red" onClick={handleLogout} mb={8}>
            Logout
          </Button>

          <Heading as="h2" size="lg" mb={4}>
            Posts
          </Heading>
          {posts.map((post, index) => (
            <Box key={index} p={4} mb={4} borderWidth={1} rounded="md">
              <Heading as="h3" size="md">
                {post.title}
              </Heading>
              <Text>{post.content}</Text>
            </Box>
          ))}

          <Button leftIcon={<FaPlus />} colorScheme="blue" mt={8}>
            Add New Post
          </Button>
        </>
      ) : (
        <Stack spacing={4}>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button leftIcon={<FaSignInAlt />} onClick={handleLogin}>
            Login
          </Button>
          <Button variant="link" onClick={handleSignup}>
            Sign up
          </Button>
        </Stack>
      )}
    </Container>
  );
};

export default Index;
