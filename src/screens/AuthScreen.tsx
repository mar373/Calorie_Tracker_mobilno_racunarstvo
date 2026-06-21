import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Mail, Lock, User, LogIn, UserPlus, AlertCircle } from 'lucide-react-native';

export const AuthScreen = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validations
  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setError('Molimo popunite sva obavezna polja.');
      return false;
    }

    if (!isLogin) {
      if (!name.trim()) {
        setError('Molimo unesite svoje ime.');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Lozinke se ne podudaraju.');
        return false;
      }
      if (password.length < 6) {
        setError('Lozinka mora imati najmanje 6 karaktera.');
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Molimo unesite ispravnu e-mail adresu.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password);
      }
    } catch (err: any) {
      setError(err.message || 'Došlo je do greške. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-950 justify-center px-6"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-indigo-500/20 rounded-3xl items-center justify-center mb-4 border border-indigo-500/30">
            <Lock size={32} color="#6366f1" />
          </View>
          <Text className="text-white text-3xl font-extrabold tracking-tight">
            {isLogin ? 'Dobrodošli nazad' : 'Napravite nalog'}
          </Text>
          <Text className="text-slate-400 text-sm mt-2 text-center">
            {isLogin 
              ? 'Prijavite se da biste nastavili sa praćenjem kalorija.' 
              : 'Započnite svoje fitnes putovanje već danas.'}
          </Text>
        </View>

        <Card className="p-6 bg-slate-900 border border-slate-800">
          {error && (
            <View className="flex-row items-center bg-red-500/10 border border-red-500/30 p-4 rounded-2xl mb-6">
              <AlertCircle size={20} color="#ef4444" className="mr-2" />
              <Text className="text-red-400 text-sm font-medium flex-1">{error}</Text>
            </View>
          )}

          {!isLogin && (
            <View className="mb-4">
              <Text className="text-slate-400 text-xs font-bold uppercase mb-2">Ime i prezime</Text>
              <View className="flex-row items-center bg-slate-800 h-14 rounded-2xl px-4 border border-slate-700 focus-within:border-indigo-500">
                <User size={20} color="#94a3b8" className="mr-3" />
                <TextInput
                  className="flex-1 text-white font-medium h-full"
                  placeholder="Marko Marković"
                  placeholderTextColor="#64748b"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <View className="mb-4">
            <Text className="text-slate-400 text-xs font-bold uppercase mb-2">E-mail adresa</Text>
            <View className="flex-row items-center bg-slate-800 h-14 rounded-2xl px-4 border border-slate-700">
              <Mail size={20} color="#94a3b8" className="mr-3" />
              <TextInput
                className="flex-1 text-white font-medium h-full"
                placeholder="example@mail.com"
                placeholderTextColor="#64748b"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-slate-400 text-xs font-bold uppercase mb-2">Lozinka</Text>
            <View className="flex-row items-center bg-slate-800 h-14 rounded-2xl px-4 border border-slate-700">
              <Lock size={20} color="#94a3b8" className="mr-3" />
              <TextInput
                className="flex-1 text-white font-medium h-full"
                placeholder="••••••"
                placeholderTextColor="#64748b"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          {!isLogin && (
            <View className="mb-6">
              <Text className="text-slate-400 text-xs font-bold uppercase mb-2">Potvrdite Lozinku</Text>
              <View className="flex-row items-center bg-slate-800 h-14 rounded-2xl px-4 border border-slate-700">
                <Lock size={20} color="#94a3b8" className="mr-3" />
                <TextInput
                  className="flex-1 text-white font-medium h-full"
                  placeholder="••••••"
                  placeholderTextColor="#64748b"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="bg-indigo-500 h-14 rounded-2xl items-center justify-center flex-row shadow-lg shadow-indigo-500/20"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                {isLogin ? (
                  <LogIn size={20} color="white" className="mr-2" />
                ) : (
                  <UserPlus size={20} color="white" className="mr-2" />
                )}
                <Text className="text-white font-bold text-lg">
                  {isLogin ? 'Prijavi se' : 'Registruj se'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleMode}
            className="mt-6 items-center"
          >
            <Text className="text-slate-400 text-sm">
              {isLogin ? 'Nemate nalog? ' : 'Već imate nalog? '}
              <Text className="text-indigo-400 font-bold">
                {isLogin ? 'Registrujte se' : 'Prijavite se'}
              </Text>
            </Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
