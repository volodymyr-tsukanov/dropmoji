/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
'use client'
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
import { ALogin, ARegister } from '@/app/actions';
import { SessionManager } from '@/lib/sec/client';
import { checkAuth } from '../Protected';


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
  const ssnManager = new SessionManager();

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
      ssnManager.initStorage(window.sessionStorage);
      const reqData = { email: form.email, password: form.password };
      const res = await (isLogin ?
        ALogin(reqData)
        : ARegister(reqData));
      if (typeof res === 'string') {
        showToastError(res || 'Something went wrong');
        setLoading(false);
        return;
      }
      ssnManager.token = res;
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

    const manager = new SessionManager(window.sessionStorage);
    if (manager.isTokenMaybeValid) {
      checkAuth(manager).then((isAuth) => {
        setIsLogin(true);
        setLoading(isAuth);
        if (isAuth) router.replace('/dashboard');
      });
    } else setLoading(false);
  }, [router]);

  return (
    <Box maxW="md" mx="auto" mt={24} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" colorPalette="brand">
      <Heading mb={6} textAlign="center">
        <Switch.Root
          variant="raised"
          size="md"
          checked={isLogin}
          onCheckedChange={(e) => setIsLogin(e.checked)}>
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb>
              <Switch.ThumbIndicator fallback={'R'}>
                L
              </Switch.ThumbIndicator>
            </Switch.Thumb>
          </Switch.Control>
          <Switch.Label fontSize="md" ml={isLogin ? "-5" : undefined}>{isLogin ? 'Login to' : 'Register for'}</Switch.Label>
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
  );
}
