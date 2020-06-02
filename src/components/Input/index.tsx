import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import {TextInputProps} from 'react-native';
import {Container, TextInput, Icon} from './style';
import {useField} from '@unform/core';
import Yup from 'yup';
import getValidationErrors from '../../utils/getValidationsErrors';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

interface SigInFormData {
  email: string;
  password: string;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  {name, icon, ...props},
  ref,
) => {
  const {registerField, defaultValue = '', fieldName, error} = useField(name);
  const inputValueRef = useRef<InputValueReference>({value: defaultValue});
  const inputElementRef = useRef<any>(null);
  const [isFocused, setFocused] = useState(false);
  const [isField, setIsField] = useState(false);

  const handleIputFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleIputBlur = useCallback(() => {
    setFocused(false);
    setIsField(!!inputValueRef.current.value);
  }, []);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({text: value});
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container isFocused={isFocused} isErrored={!!error}>
      <Icon
        name={icon}
        size={28}
        color={isFocused || isField ? '#ff9000' : '#666360'}
      />
      <TextInput
        ref={inputElementRef}
        placeholderTextColor="#666360"
        {...props}
        keyboardAppearance="dark"
        defaultValue={defaultValue}
        onFocus={handleIputFocus}
        onBlur={handleIputBlur}
        onChangeText={(value) => {
          inputValueRef.current.value = value;
        }}
      />
    </Container>
  );
};

export default forwardRef(Input);
