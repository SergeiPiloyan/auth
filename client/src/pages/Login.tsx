import { Box, Typography, Stack, Button } from '@mui/material';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { PasswordInput } from '../components/PasswordInput';
import { UsernameInput } from '../components/UsernameInput';
import { useAuth } from '../auth';

type TInputs = { user_name: string; password: string };

export const Login = () => {
    const form = useForm({
        defaultValues: { user_name: '', password: '' },
    });

    const { login } = useAuth();

    const { handleSubmit } = form;

    const onSubmit: SubmitHandler<TInputs> = async (data) => {
        await login(data);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box>
                <Typography variant='h4' sx={{ my: 5, display: 'flex', justifyContent: 'center' }}>
                    {'Login'}
                </Typography>

                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={3}>
                            <UsernameInput />
                            <PasswordInput />
                            <Button type='submit' variant='contained' sx={{ my: 2 }}>
                                {'Login'}
                            </Button>
                        </Stack>
                    </form>
                </FormProvider>
            </Box>
        </Box>
    );
};
