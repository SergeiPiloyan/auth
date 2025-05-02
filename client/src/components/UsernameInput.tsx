import { Stack, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

export const UsernameInput = () => {
    return (
        <Controller
            name={'user_name'}
            render={({ field }) => (
                <Stack>
                    <TextField size='small' label='Username' {...field} fullWidth />
                </Stack>
            )}
        />
    );
};
