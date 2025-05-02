import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

export const PasswordInput = () => {
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => setShowPassword((prev) => !prev);

    return (
        <Controller
            name='password'
            render={({ field }) => (
                <Stack>
                    <TextField
                        size='small'
                        label='Password'
                        {...field}
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton onClick={handleShowPassword} edge='end'>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
            )}
        />
    );
};
