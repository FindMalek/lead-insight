import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpCircleIcon,
  ArrowUpDown,
  BadgeCheck,
  BarChart,
  Bell,
  BookIcon,
  BookImageIcon,
  BookOpenText,
  Brain,
  Calendar,
  CalendarSearchIcon,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsRightIcon,
  ChevronsUpDown,
  Circle,
  Clock,
  CoinsIcon,
  CopyIcon,
  CreditCard,
  DatabaseZapIcon,
  DollarSign,
  File,
  FileText,
  Folder,
  GlobeIcon,
  HelpCircle,
  HospitalIcon,
  Image as ImageIcon,
  Inbox,
  Laptop,
  LayoutDashboardIcon,
  LineChartIcon,
  ListIcon,
  Loader2,
  LockIcon,
  LogOut,
  LucideIcon,
  MailIcon,
  MapPin,
  Menu,
  Monitor,
  Moon,
  MoreHorizontal,
  MoreVertical,
  PencilIcon,
  PhoneIcon,
  Pizza,
  Plus,
  PuzzleIcon,
  SaveIcon,
  Search,
  Settings,
  Shield,
  Sparkles,
  SquareTerminal,
  Stethoscope,
  SunMedium,
  ToggleRightIcon,
  Trash,
  TrendingDown,
  TrendingUp,
  UserCircleIcon,
  UserCogIcon,
  UserPlus,
  Users,
  X,
  ZapIcon,
} from "lucide-react"

export type Icon = LucideIcon

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      aria-hidden="true"
      role="img"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        fill="#9AAAB4"
        d="M27.388 24.642L24.56 27.47l-4.95-4.95l2.828-2.828z"
      />
      <path
        fill="#66757F"
        d="M34.683 29.11l-5.879-5.879a2 2 0 0 0-2.828 0l-2.828 2.828a2 2 0 0 0 0 2.828l5.879 5.879a4 4 0 1 0 5.656-5.656z"
      />
      <circle fill="#8899A6" cx="13.586" cy="13.669" r="13.5" />
      <circle fill="#BBDDF5" cx="13.586" cy="13.669" r="9.5" />
    </svg>
  )
}

export const Icons = {
  logo: LogoIcon,
  logoLucide: ChevronsRightIcon,
  close: X,
  up: ArrowUp,
  down: ArrowDown,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  media: ImageIcon,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: UserCircleIcon,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  search: Search,
  check: Check,
  orderbook: BookOpenText,
  chevronsUpDown: ChevronsUpDown,
  phone: PhoneIcon,
  mail: MailIcon,
  pencil: PencilIcon,
  student: PencilIcon,
  teacher: UserCogIcon,
  monitor: Monitor,
  lock: LockIcon,
  puzzle: PuzzleIcon,
  globe: GlobeIcon,
  databaseZap: DatabaseZapIcon,
  blog: BookImageIcon,
  graph: LineChartIcon,
  zap: ZapIcon,
  copy: CopyIcon,
  toggleRight: ToggleRightIcon,
  creditCard: CreditCard,
  calendar: Calendar,
  barChart: BarChart,
  clock: Clock,
  brain: Brain,
  menu: Menu,
  document: BookIcon,
  folder: Folder,
  more: MoreHorizontal,
  badgeCheck: BadgeCheck,
  bell: Bell,
  logOut: LogOut,
  sparkles: Sparkles,
  studio: SquareTerminal,
  register: UserPlus,
  appointment: CalendarSearchIcon,
  coins: CoinsIcon,
  location: MapPin,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  dollarSign: DollarSign,
  users: Users,
  inbox: Inbox,
  arrowUpDown: ArrowUpDown,
  circle: Circle,
  helpCircle: HelpCircle,
  shield: Shield,
  therapist: Stethoscope,
  staff: Users,
  pending: Loader2,
  approved: Check,
  rejected: X,
  contacted: MailIcon,
  demoScheduled: CalendarSearchIcon,
  demoCompleted: Check,
  contractSigned: FileText,
  onboarding: UserCogIcon,
  joined: UserPlus,
  save: SaveIcon,
  question: HelpCircle,
  clinic: HospitalIcon,
  edit: PencilIcon,
  userPlus: UserPlus,
  leave: LogOut,
  chevronDown: ChevronDown,
  dashboard: LayoutDashboardIcon,
  lifecycle: ListIcon,
  arrowUpCircle: ArrowUpCircleIcon,
}
