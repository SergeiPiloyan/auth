import { Button } from '@mui/material';
import { useAuth } from '../auth';

export const Home = () => {
    const { logout } = useAuth();

    return (
        <div>
            <div>Home Page</div>
            <Button variant='contained' onClick={logout}>
                Log out
            </Button>
        </div>
    );
};
