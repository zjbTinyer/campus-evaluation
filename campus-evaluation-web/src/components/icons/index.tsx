/**
 * SVG 图标库 — 使用 currentColor 自动适配主题色
 * 替代所有 emoji，保证跨平台一致性和主题化能力
 */
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function icon(size = 24, props: IconProps) {
  return { width: props.size || size, height: props.size || size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, ...props }
}

// ===== 导航图标 =====
export function SearchIcon(p: IconProps) {
  return <svg {...icon(24, p)}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
}
export function HomeIcon(p: IconProps) {
  return <svg {...icon(24, p)}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
}
export function UserIcon(p: IconProps) {
  return <svg {...icon(24, p)}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
export function BellIcon(p: IconProps) {
  return <svg {...icon(24, p)}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
}

// ===== 分类图标 =====
export function EvaluationIcon(p: IconProps) {
  return <svg {...icon(24, p)}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
}
export function TaskIcon(p: IconProps) {
  return <svg {...icon(24, p)}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
}
export function HonorIcon(p: IconProps) {
  return <svg {...icon(24, p)}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
}
export function ActivityIcon(p: IconProps) {
  return <svg {...icon(24, p)}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
}
export function LeaveIcon(p: IconProps) {
  return <svg {...icon(24, p)}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
}
export function ArchiveIcon(p: IconProps) {
  return <svg {...icon(24, p)}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
}
export function ClockIcon(p: IconProps) {
  return <svg {...icon(24, p)}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}

// ===== 箭头 =====
export function ChevronRight(p: IconProps) {
  return <svg {...icon(24, p)}><polyline points="9 18 15 12 9 6"/></svg>
}
export function ChevronLeft(p: IconProps) {
  return <svg {...icon(24, p)}><polyline points="15 18 9 12 15 6"/></svg>
}
export function ChevronDown(p: IconProps) {
  return <svg {...icon(24, p)}><polyline points="6 9 12 15 18 9"/></svg>
}

// ===== 状态图标 =====
export function StarIcon(p: IconProps) {
  return <svg {...icon(24, p)} fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}
export function StarFilledIcon(p: IconProps) {
  return <svg {...icon(24, p)} fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}
export function CheckIcon(p: IconProps) {
  return <svg {...icon(24, p)}><polyline points="20 6 9 17 4 12"/></svg>
}
export function CloseIcon(p: IconProps) {
  return <svg {...icon(24, p)}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}
export function PlusIcon(p: IconProps) {
  return <svg {...icon(24, p)}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
}
export function ArrowRight(p: IconProps) {
  return <svg {...icon(24, p)}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
}

// ===== 行动图标 =====
export function LogoutIcon(p: IconProps) {
  return <svg {...icon(24, p)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
}
export function SettingIcon(p: IconProps) {
  return <svg {...icon(24, p)}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
}
export function RefreshIcon(p: IconProps) {
  return <svg {...icon(24, p)}><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
}
export function LocationIcon(p: IconProps) {
  return <svg {...icon(24, p)}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
}
export function CalendarIcon(p: IconProps) {
  return <svg {...icon(24, p)}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
}
export function UsersIcon(p: IconProps) {
  return <svg {...icon(24, p)}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}

// ===== 通知类型图标 =====
export function MailIcon(p: IconProps) {
  return <svg {...icon(24, p)}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
}
export function AlertIcon(p: IconProps) {
  return <svg {...icon(24, p)}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
}

// ===== 主题专属图标 =====
export function BookIcon(p: IconProps) {
  return <svg {...icon(24, p)}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
}
export function LeafIcon(p: IconProps) {
  return <svg {...icon(24, p)}><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
}
export function SparkleIcon(p: IconProps) {
  return <svg {...icon(24, p)}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
}
