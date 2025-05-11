import { authService } from '@/services';
import { ServerError } from '@/components/auth';

export default async function FriendsPage() {
  try {
    const { verifyAccessToken } = authService();
    const user = await verifyAccessToken();
    const userData = user.data;

    return (
      <div>
        <p>Friends</p>
        <p>{userData.email}</p>
      </div>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}
