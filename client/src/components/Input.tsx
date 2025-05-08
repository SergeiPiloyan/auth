import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

type InputProps = {
    name: 'user_name' | 'password';
    label: string;
    isPassword?: boolean;
};

export const Input = (props: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const { name, label, isPassword = false } = props;

    const handleShowPassword = () => setShowPassword((prev) => !prev);

    return (
        <Controller
            name={name}
            render={({ field }) => (
                <Stack>
                    <TextField
                        size='small'
                        label={label}
                        {...field}
                        fullWidth
                        type={!isPassword || showPassword ? 'text' : 'password'}
                        InputProps={
                            isPassword
                                ? {
                                      endAdornment: (
                                          <InputAdornment position='end'>
                                              <IconButton onClick={handleShowPassword} edge='end'>
                                                  {showPassword ? (
                                                      <VisibilityOff />
                                                  ) : (
                                                      <Visibility />
                                                  )}
                                              </IconButton>
                                          </InputAdornment>
                                      ),
                                  }
                                : {}
                        }
                        onKeyDown={(e) => {
                            if (e.key === ' ') {
                                e.preventDefault();
                            }
                        }}
                    />
                </Stack>
            )}
        />
    );
};
