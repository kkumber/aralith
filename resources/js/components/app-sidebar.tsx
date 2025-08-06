import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { LessonResponse, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Book, HelpCircle, Home, Info, Mail, Sparkles } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Upload Lessons',
        href: route('main'),
        icon: Home,
    },
    {
        title: 'My Lessons',
        href: route('lesson.index'),
        icon: Book,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Features',
        href: `${route('home')}#features`,
        icon: Sparkles,
    },
    {
        title: 'About Aralith',
        href: `${route('home')}#about`,
        icon: Info,
    },
    {
        title: 'FAQ',
        href: `${route('home')}#faqs`,
        icon: HelpCircle,
    },
    {
        title: 'Contact the developer',
        href: 'https://kkumber.vercel.app',
        icon: Mail,
    },
];

export function AppSidebar() {
    const { recentLessons } = usePage<{ recentLessons: LessonResponse[] }>().props;

    const recentNavItems: NavItem[] = recentLessons.map((lesson) => ({
        title: lesson.title,
        href: route('lesson.show', lesson.id),
    }));

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('main')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} recentItems={recentNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
