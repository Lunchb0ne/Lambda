import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import { supabase } from '~/lib/supabase';
import { useAuth, ProtectedRoute } from '~/lib/auth';
import Layout from '~/components/Layout';
import { SpinnerFullPage } from '~/components/Spinner';
import { ROUTE_AUTH } from '~/config';
import { NextAppPageServerSideProps } from '~/types/app';
import router from 'next/router';
import { useFormFields } from '../lib/utils';
type UserInfoProps = {
  username: string;
};

const ProfilePage = (props) => {
  const {
    loading,
    user,
    userLoading,
    signOut,
    loggedIn,
    userName,
    updateProfile,
  } = useAuth();

  const [values, handleChange, resetFormFields] = useFormFields<UserInfoProps>({
    username: '',
  });

  useEffect(() => {
    if (!userLoading && !loggedIn) {
      Router.push(ROUTE_AUTH);
    }
  }, [userLoading, loggedIn]);

  if (userLoading) {
    return <SpinnerFullPage />;
  }

  const handleSumbit = async (event: React.FormEvent) => {
    event.preventDefault();
    updateProfile(values.username);
    resetFormFields();
  };

  return (
    <Layout useBackdrop={false}>
      <div className="h-screen flex flex-col justify-center items-center relative">
        {!user && (
          <small>
            You&aposve landed on a protected page. Please{' '}
            <Link href="/">log in</Link> to view the page&aposs full content{' '}
          </small>
        )}
        {user && (
          <>
            <form className="form-control my-4" onSubmit={handleSumbit}>
              <h2 className="text-3xl my-4">
                Howdie, {user && user.email ? user.email : 'Explorer'}!
              </h2>
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                name="username"
                type="text"
                className="input input-bordered"
                value={values.username}
                onChange={handleChange}
                placeholder={userName}
                disabled={loading}
              />
              <button type="submit" className="m-2 btn btn-primary">
                Update Username
              </button>
            </form>
            <div className="flex">
              <button onClick={signOut} className="m-2 btn btn-primary">
                Sign Out
              </button>
              <button
                onClick={() => router.push('./tiptapeditor')}
                className="m-2 btn btn-primary"
              >
                Editor
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;

// Fetch user data server-side to eliminate a flash of unauthenticated content.
// We're identifying the logged-in user through supabase cookies and either redirecting to  `/` if the user is not found, or sending the `user` and `loggedIn` props which can be available to the above component through `props`.
export const getServerSideProps: GetServerSideProps = async ({
  req,
}): Promise<NextAppPageServerSideProps> => {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  // We can do a re-direction from the server
  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  // or, alternatively, can send the same values that client-side context populates to check on the client and redirect
  // The following lines won't be used as we're redirecting above
  return {
    props: {
      user,
      loggedIn: !!user,
    },
  };
};

// As there could be many pages that'll be required to be rendered only for the logged-in users, and the above logic
// for indetifying authenticity could become repetitive, there's a wrapper component `ProtectedRoute` already available
// that could be used like
/*
export const getServerSideProps: GetServerSideProps = (context) => ProtectedRoute({ context, getPropsFunc: async (options) => {
    return {
        'more': 'data'
    }
}})
*/
