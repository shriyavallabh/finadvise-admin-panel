// Core Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: Role
  permissions: Permission[]
  lastLogin: Date
  isActive: boolean
}

export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  VIEWER = 'viewer'
}

export enum Permission {
  AGENTS_VIEW = 'agents:view',
  AGENTS_MANAGE = 'agents:manage',
  AGENTS_CONFIG = 'agents:config',
  CONTENT_VIEW = 'content:view',
  CONTENT_CREATE = 'content:create',
  CONTENT_EDIT = 'content:edit',
  CONTENT_DELETE = 'content:delete',
  CONTENT_APPROVE = 'content:approve',
  ADVISORS_VIEW = 'advisors:view',
  ADVISORS_MANAGE = 'advisors:manage',
  CAMPAIGNS_VIEW = 'campaigns:view',
  CAMPAIGNS_CREATE = 'campaigns:create',
  CAMPAIGNS_MANAGE = 'campaigns:manage',
  ANALYTICS_VIEW = 'analytics:view',
  SYSTEM_CONFIG = 'system:config',
  SYSTEM_LOGS = 'system:logs'
}

// Agent Types
export interface Agent {
  id: string
  name: string
  type: AgentType
  status: AgentStatus
  description: string
  version: string
  config: AgentConfig
  metrics: AgentMetrics
  dependencies: string[]
  lastActivity: Date
  createdAt: Date
  updatedAt: Date
}

export enum AgentType {
  CONTENT_GENERATOR = 'content_generator',
  DISTRIBUTION_MANAGER = 'distribution_manager',
  COMPLIANCE_VALIDATOR = 'compliance_validator',
  ANALYTICS_PROCESSOR = 'analytics_processor',
  MARKET_INTELLIGENCE = 'market_intelligence',
  ADVISOR_MANAGER = 'advisor_manager',
  TEMPLATE_OPTIMIZER = 'template_optimizer',
  QUALITY_SCORER = 'quality_scorer'
}

export enum AgentStatus {
  ACTIVE = 'active',
  IDLE = 'idle',
  PROCESSING = 'processing',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
  STOPPED = 'stopped'
}

export interface AgentConfig {
  [key: string]: any
  environment: Record<string, string>
  parameters: Record<string, any>
  schedule?: CronExpression
  retryPolicy: RetryPolicy
  resources: ResourceLimits
}

export interface AgentMetrics {
  cpu: number
  memory: number
  requestsPerSecond: number
  errorRate: number
  avgResponseTime: number
  uptime: number
  totalRequests: number
  totalErrors: number
  lastUpdate: Date
}

export interface RetryPolicy {
  maxRetries: number
  backoffStrategy: 'exponential' | 'linear' | 'fixed'
  initialDelay: number
  maxDelay: number
}

export interface ResourceLimits {
  maxCpu: number
  maxMemory: number
  maxConcurrency: number
}

// Template Types
export interface Template {
  id: string
  name: string
  type: TemplateType
  category: TemplateCategory
  content: TemplateContent
  variables: TemplateVariable[]
  status: TemplateStatus
  version: number
  author: string
  tags: string[]
  performance: TemplateMetrics
  approval: ApprovalWorkflow
  createdAt: Date
  updatedAt: Date
}

export enum TemplateType {
  WHATSAPP = 'whatsapp',
  LINKEDIN = 'linkedin',
  EMAIL = 'email',
  SMS = 'sms'
}

export enum TemplateCategory {
  MARKETING = 'marketing',
  UTILITY = 'utility',
  EDUCATIONAL = 'educational',
  NOTIFICATION = 'notification',
  AUTHENTICATION = 'authentication'
}

export interface TemplateContent {
  header?: TemplateHeader
  body: string
  footer?: string
  buttons?: TemplateButton[]
  media?: MediaAttachment[]
}

export interface TemplateHeader {
  type: 'text' | 'image' | 'video' | 'document'
  content: string
}

export interface TemplateButton {
  type: 'url' | 'phone' | 'quick_reply'
  text: string
  url?: string
  phone?: string
}

export interface MediaAttachment {
  type: 'image' | 'video' | 'audio' | 'document'
  url: string
  filename?: string
  caption?: string
}

export interface TemplateVariable {
  name: string
  type: 'text' | 'number' | 'date' | 'url' | 'phone'
  defaultValue?: string
  required: boolean
  description: string
}

export enum TemplateStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived'
}

export interface TemplateMetrics {
  views: number
  clicks: number
  conversions: number
  deliveryRate: number
  engagementRate: number
  conversionRate: number
  lastUsed: Date
}

export interface ApprovalWorkflow {
  status: TemplateStatus
  submittedAt?: Date
  submittedBy?: string
  reviewedAt?: Date
  reviewedBy?: string
  comments?: string
  history: ApprovalStep[]
}

export interface ApprovalStep {
  action: 'submitted' | 'approved' | 'rejected' | 'revision_requested'
  userId: string
  timestamp: Date
  comments?: string
}

// Advisor Types
export interface Advisor {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  location: Location
  segments: string[]
  score: number
  tier: AdvisorTier
  status: AdvisorStatus
  preferences: AdvisorPreferences
  activity: AdvisorActivity[]
  metrics: AdvisorMetrics
  tags: string[]
  customFields: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface Location {
  country: string
  state: string
  city: string
  timezone: string
}

export enum AdvisorTier {
  PLATINUM = 'platinum',
  GOLD = 'gold',
  SILVER = 'silver',
  BRONZE = 'bronze'
}

export enum AdvisorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export interface AdvisorPreferences {
  communicationChannels: CommunicationChannel[]
  contentTypes: string[]
  frequency: CommunicationFrequency
  optedOut: boolean
  language: string
}

export enum CommunicationChannel {
  WHATSAPP = 'whatsapp',
  LINKEDIN = 'linkedin',
  EMAIL = 'email',
  SMS = 'sms'
}

export enum CommunicationFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly'
}

export interface AdvisorActivity {
  id: string
  type: ActivityType
  description: string
  metadata: Record<string, any>
  timestamp: Date
}

export enum ActivityType {
  MESSAGE_SENT = 'message_sent',
  MESSAGE_RECEIVED = 'message_received',
  CAMPAIGN_INTERACTION = 'campaign_interaction',
  PROFILE_UPDATE = 'profile_update',
  SEGMENTATION_CHANGE = 'segmentation_change',
  STATUS_CHANGE = 'status_change'
}

export interface AdvisorMetrics {
  totalMessages: number
  responseRate: number
  engagementRate: number
  conversionRate: number
  lastActivity: Date
  averageResponseTime: number
  totalCampaigns: number
  successfulCampaigns: number
}

// Campaign Types
export interface Campaign {
  id: string
  name: string
  description: string
  type: CampaignType
  status: CampaignStatus
  objective: CampaignObjective
  audience: AudienceSegment
  content: CampaignContent
  schedule: CampaignSchedule
  budget: CampaignBudget
  metrics: CampaignMetrics
  workflow: CampaignWorkflow
  abTest?: ABTestConfig
  createdBy: string
  createdAt: Date
  updatedAt: Date
  startDate: Date
  endDate?: Date
}

export enum CampaignType {
  BROADCAST = 'broadcast',
  DRIP = 'drip',
  TRIGGERED = 'triggered',
  AB_TEST = 'ab_test'
}

export enum CampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum CampaignObjective {
  AWARENESS = 'awareness',
  ENGAGEMENT = 'engagement',
  CONVERSION = 'conversion',
  RETENTION = 'retention',
  EDUCATION = 'education'
}

export interface AudienceSegment {
  id: string
  name: string
  criteria: SegmentCriteria[]
  size: number
  description: string
}

export interface SegmentCriteria {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  value: any
  logicalOperator?: 'AND' | 'OR'
}

export interface CampaignContent {
  templates: string[]
  media: MediaAttachment[]
  personalization: PersonalizationRule[]
}

export interface PersonalizationRule {
  field: string
  template: string
  fallback?: string
}

export interface CampaignSchedule {
  type: 'immediate' | 'scheduled' | 'recurring'
  startDate: Date
  endDate?: Date
  timezone: string
  frequency?: ScheduleFrequency
  daysOfWeek?: number[]
  timeSlots?: TimeSlot[]
}

export interface ScheduleFrequency {
  interval: number
  unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months'
}

export interface TimeSlot {
  start: string // HH:mm format
  end: string // HH:mm format
}

export interface CampaignBudget {
  total: number
  spent: number
  currency: string
  costPerMessage: number
  limits: BudgetLimits
}

export interface BudgetLimits {
  dailyLimit?: number
  weeklyLimit?: number
  monthlyLimit?: number
}

export interface CampaignMetrics {
  sent: number
  delivered: number
  read: number
  clicked: number
  converted: number
  failed: number
  deliveryRate: number
  openRate: number
  clickRate: number
  conversionRate: number
  cost: number
  roi: number
  lastUpdate: Date
}

export interface CampaignWorkflow {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  variables: WorkflowVariable[]
}

export interface WorkflowNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: NodeData
}

export enum NodeType {
  START = 'start',
  END = 'end',
  MESSAGE = 'message',
  CONDITION = 'condition',
  WAIT = 'wait',
  ACTION = 'action',
  BRANCH = 'branch'
}

export interface NodeData {
  label: string
  config: Record<string, any>
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  type?: string
  conditions?: EdgeCondition[]
}

export interface EdgeCondition {
  field: string
  operator: string
  value: any
}

export interface WorkflowVariable {
  name: string
  type: string
  defaultValue?: any
  description: string
}

export interface ABTestConfig {
  variants: ABTestVariant[]
  trafficSplit: number[]
  successMetric: string
  confidenceLevel: number
  duration: number
}

export interface ABTestVariant {
  id: string
  name: string
  content: CampaignContent
  weight: number
}

// Analytics Types
export interface AnalyticsData {
  overview: OverviewMetrics
  agents: AgentAnalytics[]
  content: ContentAnalytics
  campaigns: CampaignAnalytics[]
  advisors: AdvisorAnalytics
  trends: TrendData[]
}

export interface OverviewMetrics {
  totalMessages: number
  activeAgents: number
  activeCampaigns: number
  totalAdvisors: number
  deliveryRate: number
  engagementRate: number
  systemHealth: number
  period: DateRange
}

export interface AgentAnalytics {
  agentId: string
  name: string
  performance: PerformanceMetrics
  efficiency: EfficiencyMetrics
  errors: ErrorMetrics
}

export interface PerformanceMetrics {
  throughput: number
  latency: number
  availability: number
  successRate: number
}

export interface EfficiencyMetrics {
  resourceUtilization: number
  costEfficiency: number
  qualityScore: number
}

export interface ErrorMetrics {
  errorRate: number
  errorTypes: ErrorBreakdown[]
  resolution: ResolutionMetrics
}

export interface ErrorBreakdown {
  type: string
  count: number
  percentage: number
}

export interface ResolutionMetrics {
  averageResolutionTime: number
  escalationRate: number
}

export interface ContentAnalytics {
  templates: TemplatePerformance[]
  engagement: EngagementMetrics
  trends: ContentTrends
}

export interface TemplatePerformance {
  templateId: string
  name: string
  usage: number
  performance: TemplateMetrics
  ranking: number
}

export interface EngagementMetrics {
  totalViews: number
  totalClicks: number
  averageEngagementTime: number
  topPerformingContent: string[]
}

export interface ContentTrends {
  popularTopics: Topic[]
  seasonalPatterns: SeasonalPattern[]
  performanceByTime: TimeSeriesData[]
}

export interface Topic {
  name: string
  mentions: number
  sentiment: number
  trend: 'up' | 'down' | 'stable'
}

export interface SeasonalPattern {
  period: string
  metric: string
  pattern: number[]
}

export interface CampaignAnalytics {
  campaignId: string
  name: string
  performance: CampaignMetrics
  comparison: ComparisonData
  insights: Insight[]
}

export interface ComparisonData {
  previousPeriod: CampaignMetrics
  benchmark: CampaignMetrics
  variance: VarianceData
}

export interface VarianceData {
  [key: string]: {
    absolute: number
    percentage: number
    trend: 'up' | 'down' | 'stable'
  }
}

export interface Insight {
  type: 'opportunity' | 'issue' | 'trend'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  actionable: boolean
  recommendation?: string
}

export interface AdvisorAnalytics {
  segments: SegmentAnalytics[]
  engagement: AdvisorEngagementMetrics
  retention: RetentionMetrics
  growth: GrowthMetrics
}

export interface SegmentAnalytics {
  segmentId: string
  name: string
  size: number
  performance: SegmentPerformance
  trends: SegmentTrends
}

export interface SegmentPerformance {
  engagementRate: number
  conversionRate: number
  retentionRate: number
  value: number
}

export interface SegmentTrends {
  growth: number
  churn: number
  activation: number
}

export interface AdvisorEngagementMetrics {
  activeUsers: number
  sessionDuration: number
  pageViews: number
  bounceRate: number
}

export interface RetentionMetrics {
  day1: number
  day7: number
  day30: number
  day90: number
}

export interface GrowthMetrics {
  newAdvisors: number
  churnedAdvisors: number
  netGrowth: number
  growthRate: number
}

export interface TrendData {
  metric: string
  data: TimeSeriesPoint[]
  forecast?: TimeSeriesPoint[]
}

export interface TimeSeriesPoint {
  timestamp: Date
  value: number
  metadata?: Record<string, any>
}

export interface TimeSeriesData {
  timestamp: Date
  value: number
}

// System Types
export interface SystemConfig {
  api: ApiConfig
  database: DatabaseConfig
  cache: CacheConfig
  messaging: MessagingConfig
  security: SecurityConfig
  monitoring: MonitoringConfig
}

export interface ApiConfig {
  baseUrl: string
  timeout: number
  retries: number
  rateLimit: RateLimit
}

export interface RateLimit {
  requests: number
  window: number
  strategy: 'fixed' | 'sliding'
}

export interface DatabaseConfig {
  host: string
  port: number
  database: string
  poolSize: number
  connectionTimeout: number
}

export interface CacheConfig {
  provider: 'redis' | 'memory'
  host?: string
  port?: number
  ttl: number
  maxSize: number
}

export interface MessagingConfig {
  whatsapp: WhatsAppConfig
  linkedin: LinkedInConfig
  email: EmailConfig
}

export interface WhatsAppConfig {
  apiUrl: string
  businessId: string
  accessToken: string
  webhookUrl: string
  verifyToken: string
}

export interface LinkedInConfig {
  clientId: string
  clientSecret: string
  redirectUrl: string
  apiVersion: string
}

export interface EmailConfig {
  provider: string
  apiKey: string
  fromAddress: string
  replyToAddress: string
}

export interface SecurityConfig {
  authentication: AuthConfig
  encryption: EncryptionConfig
  audit: AuditConfig
}

export interface AuthConfig {
  jwtSecret: string
  tokenExpiry: number
  refreshTokenExpiry: number
  mfaEnabled: boolean
}

export interface EncryptionConfig {
  algorithm: string
  keySize: number
  iv: string
}

export interface AuditConfig {
  enabled: boolean
  logLevel: 'error' | 'warn' | 'info' | 'debug'
  retention: number
}

export interface MonitoringConfig {
  enabled: boolean
  interval: number
  alerts: AlertConfig[]
}

export interface AlertConfig {
  metric: string
  threshold: number
  condition: 'greater_than' | 'less_than' | 'equals'
  channels: string[]
}

// Utility Types
export interface DateRange {
  start: Date
  end: Date
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterParams {
  [key: string]: any
}

export interface SearchParams {
  query: string
  fields?: string[]
  filters?: FilterParams
}

export interface ApiResponse<T> {
  data: T
  meta?: {
    pagination?: PaginationMeta
    filters?: FilterParams
    total?: number
  }
  errors?: ApiError[]
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiError {
  code: string
  message: string
  field?: string
  details?: Record<string, any>
}

export type CronExpression = string

// WebSocket Types
export interface WebSocketMessage<T = any> {
  type: string
  payload: T
  timestamp: Date
  id: string
}

export interface AgentStatusUpdate {
  agentId: string
  status: AgentStatus
  metrics: AgentMetrics
  timestamp: Date
}

export interface LogEntry {
  id: string
  level: 'error' | 'warn' | 'info' | 'debug'
  message: string
  agent?: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface SystemAlert {
  id: string
  type: 'error' | 'warning' | 'info'
  title: string
  message: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  source: string
  timestamp: Date
  acknowledged: boolean
}

// Form Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file'
  required: boolean
  placeholder?: string
  description?: string
  options?: SelectOption[]
  validation?: ValidationRule[]
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom'
  value?: any
  message: string
}

// Component Props Types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingState {
  isLoading: boolean
  error?: string | null
}

export interface AsyncComponentProps extends BaseComponentProps, LoadingState {}