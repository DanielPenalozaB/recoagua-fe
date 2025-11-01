import {
	BarChart3,
	BookOpen,
	Calendar,
	Droplets,
	Eye,
	Globe,
	PieChart,
	Target,
	TrendingUp,
	Trophy,
	Users,
} from "lucide-react";
import { Main } from "@/components/layout/main";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import ThemeSwitch from "@/components/ui/client-theme-switch";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const popularGuides = [
	{
		title: "Conservación del Agua",
		completion: 85,
		users: 1240,
	},
	{
		title: "Ciclo Hidrológico",
		completion: 72,
		users: 987,
	},
	{
		title: "Fuentes de Contaminación",
		completion: 68,
		users: 845,
	},
	{
		title: "Técnicas de Riego",
		completion: 63,
		users: 732,
	},
	{
		title: "Ecosistemas Acuáticos",
		completion: 59,
		users: 621,
	},
];

const recentContent = [
	{
		title: "Guía: Uso Responsable",
		type: "guide",
		date: "Hace 2 días",
		status: "Publicado",
	},
	{
		title: "Módulo: Agua Subterránea",
		type: "module",
		date: "Hace 5 días",
		status: "Borrador",
	},
	{
		title: "Bloque: Quiz Calidad del Agua",
		type: "block",
		date: "Hace 1 semana",
		status: "Publicado",
	},
	{
		title: "Guía: Tratamiento de Aguas",
		type: "guide",
		date: "Hace 2 semanas",
		status: "Publicado",
	},
];

export default function Dashboard() {
	return (
		<>
			<header className="flex justify-between items-center gap-2 h-16 shrink-0">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
				</div>
				<div className="flex items-center gap-4 pr-2">
					<ThemeSwitch />
					<ProfileDropdown />
				</div>
			</header>
			<Main>
				<div className="flex justify-between items-center space-y-2 mb-6">
					<div>
						<h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
						<p className="mt-2 text-muted-foreground">
							Resumen general de la plataforma RecoAgua
						</p>
					</div>
					<div className="flex items-center space-x-2">
						<Button variant="outline">
							<Calendar className="mr-2 w-4 h-4" />
							Filtros
						</Button>
						<Button>
							<TrendingUp className="mr-2 w-4 h-4" />
							Generar Reporte
						</Button>
					</div>
				</div>
				<Tabs defaultValue="overview" className="space-y-6 w-full">
					<TabsList className="justify-start w-full">
						<TabsTrigger value="overview">Resumen</TabsTrigger>
						<TabsTrigger value="content">Contenido</TabsTrigger>
						<TabsTrigger value="users">Usuarios</TabsTrigger>
						<TabsTrigger value="locations">Ubicaciones</TabsTrigger>
						<TabsTrigger value="gamification">Gamificación</TabsTrigger>
					</TabsList>
					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-6">
						<div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
							<Card>
								<CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">
										Total de Usuarios
									</CardTitle>
									<Users className="w-4 h-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">2,548</div>
									<p className="text-muted-foreground text-xs">
										<span className="text-green-600">+12%</span> desde el mes
										pasado
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">
										Guías Completadas
									</CardTitle>
									<BookOpen className="w-4 h-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">1,237</div>
									<p className="text-muted-foreground text-xs">
										<span className="text-green-600">+8%</span> desde el mes
										pasado
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">
										Retos Activos
									</CardTitle>
									<Target className="w-4 h-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">48</div>
									<p className="text-muted-foreground text-xs">
										<span className="text-green-600">+5</span> nuevos este mes
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">
										Participación
									</CardTitle>
									<Eye className="w-4 h-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">78%</div>
									<p className="text-muted-foreground text-xs">
										<span className="text-green-600">+3%</span> desde la semana
										pasada
									</p>
								</CardContent>
							</Card>
						</div>
						<div className="gap-6 grid grid-cols-1 lg:grid-cols-7">
							<Card className="col-span-1 lg:col-span-4">
								<CardHeader>
									<CardTitle>Actividad de Usuarios</CardTitle>
									<CardDescription>
										Participación en los últimos 30 días
									</CardDescription>
								</CardHeader>
								<CardContent className="pl-2">
									<div className="flex justify-center items-center h-80 text-muted-foreground">
										<BarChart3 className="mr-2 w-12 h-12" />
										<span>Gráfico de actividad</span>
									</div>
								</CardContent>
							</Card>
							<Card className="col-span-1 lg:col-span-3">
								<CardHeader>
									<CardTitle>Guías Populares</CardTitle>
									<CardDescription>
										Las guías con mayor participación
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{popularGuides.map((guide, index) => (
											<div
												key={`participation-guide-${index.toString()}`}
												className="flex items-center"
											>
												<div className="flex justify-center items-center bg-teal-100 rounded-lg w-9 h-9 text-teal-600">
													<BookOpen className="w-5 h-5" />
												</div>
												<div className="space-y-1 ml-4">
													<p className="font-medium text-sm leading-none">
														{guide.title}
													</p>
													<p className="text-muted-foreground text-sm">
														{guide.completion}% completado
													</p>
												</div>
												<div className="ml-auto font-medium">
													{guide.users} usuarios
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
						<div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							<Card>
								<CardHeader className="pb-3">
									<CardTitle>Distribución por Regiones</CardTitle>
									<CardDescription>Usuarios activos por región</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex justify-center items-center h-40 text-muted-foreground">
										<Globe className="mr-2 w-8 h-8" />
										<span>Mapa de regiones</span>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="pb-3">
									<CardTitle>Progreso de Retos</CardTitle>
									<CardDescription>Estado de los retos activos</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="flex justify-between items-center">
											<span className="text-sm">Retos completados</span>
											<span className="font-medium text-sm">65%</span>
										</div>
										<div className="bg-gray-200 rounded-full h-2">
											<div
												className="bg-teal-600 rounded-full h-2"
												style={{ width: "65%" }}
											></div>
										</div>
										<div className="flex justify-between items-center mt-4">
											<span className="text-sm">Retos en progreso</span>
											<span className="font-medium text-sm">25%</span>
										</div>
										<div className="bg-gray-200 rounded-full h-2">
											<div
												className="bg-blue-600 rounded-full h-2"
												style={{ width: "25%" }}
											></div>
										</div>
										<div className="flex justify-between items-center mt-4">
											<span className="text-sm">Retos no iniciados</span>
											<span className="font-medium text-sm">10%</span>
										</div>
										<div className="bg-gray-200 rounded-full h-2">
											<div
												className="bg-gray-400 rounded-full h-2"
												style={{ width: "10%" }}
											></div>
										</div>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="pb-3">
									<CardTitle>Insignias Otorgadas</CardTitle>
									<CardDescription>Distribución por tipo</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex justify-center items-center h-40 text-muted-foreground">
										<Trophy className="mr-2 w-8 h-8" />
										<span>Gráfico de insignias</span>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
					{/* Content Tab */}
					<TabsContent value="content" className="space-y-6 w-ful">
						<div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
							<Card>
								<CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">
										Total de Guías
									</CardTitle>
									<BookOpen className="w-4 h-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">42</div>
									<p className="text-muted-foreground text-xs">
										<span className="text-green-600">+3</span> nuevas este mes
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">
										Módulos Creados
									</CardTitle>
									<Droplets className="w-4 h-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">128</div>
									<p className="text-muted-foreground text-xs">
										<span className="text-green-600">+12%</span> desde el mes
										pasado
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">
										Bloques Activos
									</CardTitle>
									<BarChart3 className="w-4 h-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">576</div>
									<p className="text-muted-foreground text-xs">
										Promedio de 4.5 bloques por módulo
									</p>
								</CardContent>
							</Card>
						</div>
						<div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>Guías por Categoría</CardTitle>
									<CardDescription>Distribución de contenido</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex justify-center items-center h-60 text-muted-foreground">
										<PieChart className="mr-2 w-8 h-8" />
										<span>Gráfico de categorías</span>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Contenido Reciente</CardTitle>
									<CardDescription>Últimas guías añadidas</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{recentContent.map((item, index) => (
											<div key={index.toString()} className="flex items-center">
												<div
													className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.type === "guide" ? "bg-teal-100 text-teal-600" : item.type === "module" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}
												>
													{item.type === "guide" ? (
														<BookOpen className="w-5 h-5" />
													) : item.type === "module" ? (
														<Droplets className="w-5 h-5" />
													) : (
														<BarChart3 className="w-5 h-5" />
													)}
												</div>
												<div className="space-y-1 ml-4">
													<p className="font-medium text-sm leading-none">
														{item.title}
													</p>
													<p className="text-muted-foreground text-sm">
														{item.date}
													</p>
												</div>
												<div className="ml-auto font-medium">{item.status}</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</Main>
		</>
	);
}
