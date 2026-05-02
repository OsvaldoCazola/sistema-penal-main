import { type ReactNode } from  react
import { cn } from @/lib/utils

export interface CardProps {
  children?: ReactNode
  className?: string
  padding?: none | sm | md | lg
  onClick?: any
  title?: string
  subtitle?: string
  action?: ReactNode
  variant?: default | angola | borderless
}

export function Card({ children, className, padding = md, onClick, title, subtitle, action, variant = default }: CardProps) {
  const paddings = { none: , sm: p-3, md: p-4 sm:p-5, lg: p-5 sm:p-6 }
 return (
 <div className={cn(paddings[padding], rounded-xl border transition-colors duration-200, variant === angola && relative overflow-hidden, variant === borderless && border-0, onClick && cursor-pointer, className)} onClick={onClick}>
 {(title || subtitle || action) && (
 <div className=flex items-start justify-between mb-4 pb-3 border-b>
 <div>{title && <CardTitleX>{title}</CardTitleX>}{subtitle && <CardDescriptionX>{subtitle}</CardDescriptionX>}</div>
 {action && <div>{action}</div>}
 </div>
 )}
 {children}
 {variant === angola && <div className=absolute bottom-0 left-0 right-0 h-1 flex><div className=flex-1 bg-red-600 /><div className=flex-1 bg-black /><div className=flex-1 bg-yellow-400 /></div>}
 </div>
 )
}

export function CardHeader({ title, subtitle, action, className, children }: any) {
 return <div className={cn(flex items-start justify-between mb-4 pb-3 border-b, className)}><div>{title && <CardTitleX>{title}</CardTitleX>}{subtitle && <CardDescriptionX>{subtitle}</CardDescriptionX>}</div>{action && <div>{action}</div>}{children}</div>
}

export function CardTitleX({ children, className }: any) {
 return <h3 className={cn(text-lg font-semibold, className)}>{children}</h3>
}

export function CardDescriptionX({ children, className }: any) {
 return <p className={cn(text-sm mt-0.5, className)}>{children}</p>
}

export function CardContent({ children, className }: any) {
 return <div className={cn(p-0 pt-0, className)}>{children}</div>
}
