export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  DiscussionDetail: { postId: string; title: string };
  MemberProfile: { userId: string; displayName?: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Leaderboard: undefined;
  Discussions: undefined;
  Activity: undefined;
  Profile: undefined;
  Settings: undefined;
};
