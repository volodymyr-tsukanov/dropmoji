/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
'use client';
import {
  Box,
  Stack,
  Heading,
  Button,
  Switch,
  Input,
  Field
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toaster } from '@/components/ui/toaster';
import { Provider } from '@/components/ui/provider';
import { AExtendSession, ALogin, ARegister } from '@/app/actions';
import { TokenManager } from '@/lib/sec/client';


type AuthFormData = {
  email: string;
  password: string;
};


const showToastError = (title: string) =>
  toaster.create({
    title: title,
    type: 'error',
    duration: 5000,
    closable: true
  });


export default function AuthPage() {
  const [form, setForm] = useState<AuthFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<AuthFormData>>({});
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const tknManager = new TokenManager();

  const validate = () => {
    const newErrors: Partial<AuthFormData> = {};
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/.test(form.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!form.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Minimum 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      tknManager.initStorage(window.sessionStorage);
      const reqData = { email: form.email, password: form.password };
      const res = await (isLogin ?
        ALogin(reqData)
        : ARegister(reqData));
      if (typeof res === 'string') {
        showToastError(res || 'Something went wrong');
        setLoading(false);
        return;
      }
      tknManager.token = res;
      router.replace('/dashboard');
      setIsLogin(true);
    } catch (err) {
      console.error(err);
      showToastError('Network error');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const manager = new TokenManager(window.sessionStorage);
    const token = manager.token;
    if (token) {
      const checkToken = async () => {
        try {
          const extendedToken = await AExtendSession(token);
          if (extendedToken) {
            manager.resetToken(extendedToken);
            router.replace('/dashboard');
          } else {
            manager.invalidateToken();
            setLoading(false);
          }
        } catch (err) {
          console.error('Session extension failed', err);
          manager.invalidateToken();
        } finally {
          setIsLogin(true);
        }
      };
      checkToken();
    } else {
      setLoading(false);
    }
  }, [router]);

  return (
    <Provider>
      <Box maxW="md" mx="auto" mt={24} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <Heading mb={6} textAlign="center">
          <Switch.Root
            size="lg"
            checked={isLogin}
            onCheckedChange={(e) => setIsLogin(e.checked)}>
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
              <Switch.Indicator fallback={'o'}>
                t
              </Switch.Indicator>
            </Switch.Control>
            <Switch.Label fontSize="md">{isLogin ? 'Login to' : 'Register for'}</Switch.Label>
          </Switch.Root> DropMoji
        </Heading>

        <form onSubmit={handleSubmit}>
          <Stack>
            <Field.Root invalid={!!errors.email}>
              <Field.Label>Email</Field.Label>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
              <Field.ErrorText>{errors.email}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.password}>
              <Field.Label>Password</Field.Label>
              <Input
                name="password"
                type="password"
                placeholder="type here wisely"
                value={form.password}
                onChange={handleChange}
              />
              <Field.ErrorText>{errors.password}</Field.ErrorText>
            </Field.Root>

            <Button colorScheme="blue" type="submit" loading={loading} width="full">
              Proceed
            </Button>
          </Stack>
        </form>
        <Toaster />
      </Box>
    </Provider>
  );
}
