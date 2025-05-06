import { Box, Typography, Stack, Button } from '@mui/material';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { PasswordInput } from '../components/PasswordInput';
import { UsernameInput } from '../components/UsernameInput';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

type TInputs = { user_name: string; password: string };

export const Auth = (props: { isLogin: boolean }) => {
    const { isLogin } = props;

    const navigate = useNavigate();

    const handleRegisterRedirect = () => {
        navigate(isLogin ? '/registration' : '/login');
    };

    const form = useForm({
        defaultValues: { user_name: '', password: '' },
    });

    const { login, registration } = useAuth();

    const { handleSubmit } = form;

    const onSubmit: SubmitHandler<TInputs> = async (data) => {
        if (isLogin) {
            await login(data);
        } else {
            await registration(data);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box>
                <Typography variant='h4' sx={{ my: 5, display: 'flex', justifyContent: 'center' }}>
                    {isLogin ? 'Log in' : 'Sign Up'}
                </Typography>

                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={3}>
                            <UsernameInput />
                            <PasswordInput />
                            <Button type='submit' variant='contained' sx={{ my: 2 }}>
                                {isLogin ? 'Log in' : 'Sign Up'}
                            </Button>
                            <Button onClick={handleRegisterRedirect} sx={{ my: 2 }}>
                                {isLogin ? `Don't have an account?` : `Have an account?`}
                            </Button>
                        </Stack>
                    </form>
                </FormProvider>
            </Box>
        </Box>
    );
};
