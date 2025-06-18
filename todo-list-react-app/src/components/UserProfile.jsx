


// components/UserProfile.jsx
const UserProfile = ({ user }) => {
  return (
    <div className="user-profile flex items-center space-x-3">
      <span className="username font-medium">{user?.username}</span>
      <div className="avatar w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
        {user?.username?.[0]?.toUpperCase()}
      </div>
    </div>
  );
}; 

export default UserProfile;