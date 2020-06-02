import React, {useCallback, useRef} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import logo from '../../assets/logo.jpg';

import Input from '../../components/Input';
import Button from '../../components/Button';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {Form} from '@unform/mobile';
import {FormHandles} from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationsErrors';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './style';

const SigIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();
  const passwordInputRef = useRef<TextInput>(null);

  interface SigInFormData {
    email: string;
    password: string;
  }

  const handleSigIn = useCallback(async (data: SigInFormData) => {
    try {
      formRef.current.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().required('Senha obrigatória'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      // await sigIn({
      //   email: data.email,
      //   password: data.password,
      // });

      // history.push('/dashboard');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        console.log(error.errors);
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);

        return;
      }

      Alert.alert(
        'Erro na autenticação',
        'Ocorreu um erro ao fazer o login, cheque suas credenciais',
      );
    }
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}
        enabled>
        <ScrollView
          contentContainerStyle={{flex: 1}}
          keyboardShouldPersistTaps="handled">
          <Container>
            <Image
              source={logo}
              style={{height: 150, width: 200, marginBottom: 20}}
            />
            <View>
              <Title>Faça seu logon:</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSigIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                returnKeyType="send"
                name="password"
                icon="lock"
                placeholder="Senha"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />
              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}>
                Entrar
              </Button>
            </Form>

            <ForgotPassword onPress={() => console.log('teste')}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>

          <CreateAccountButton onPress={() => navigation.navigate('SigUp')}>
            <Icon name="log-in" size={28} color="#ff9000" />
            <CreateAccountButtonText>Criar conta</CreateAccountButtonText>
          </CreateAccountButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default SigIn;
