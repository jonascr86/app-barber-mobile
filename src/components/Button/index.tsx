import React from 'react';
import {Container, ButtonText} from './style';
import {RectButtonProperties} from 'react-native-gesture-handler';

interface ButtonProps extends RectButtonProperties {
  children: string;
}

const Button: React.FC<ButtonProps> = ({children, ...props}) => (
  <Container {...props}>
    <ButtonText>{children}</ButtonText>
  </Container>
);

export default Button;
