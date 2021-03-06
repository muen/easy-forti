interface IKey {
  origin: string;
  created: Date;
  browsers: string[]
}

type IsFetchingType = 'pending' | 'resolved' | 'rejected';

type ThemeType = ('system' | 'dark' | 'light');

type UpdateInfoType = {
  version: string;
  createdAt: number;
};

type TabType = 'requests' | 'settings' | 'tools' | 'about';

type PriorityType = 'trivial' | 'normal' | 'important';
