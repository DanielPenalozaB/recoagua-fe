"use client";

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
import {
  BarChart3,
  BookOpen,
  Calendar,
  Eye,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

import { useDashboardStats } from "@/hooks/use-dashboard";

export default function Dashboard() {
  const { data: stats, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-gray-900 border-b-2 rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Error al cargar el dashboard. Por favor intenta nuevamente.</p>
      </div>
    );
  }

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
      <Main className="space-y-6">
        <div className="flex justify-between items-center space-y-2 mb-6">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
            <p className="mt-2 text-muted-foreground">
              Resumen general de la plataforma RecoAgua
            </p>
          </div>
        </div>
        <div className="space-y-6 w-full">
          <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  Total de Usuarios
                </CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {stats.data.totalUsers}
                </div>
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
                <div className="font-bold text-2xl">
                  {stats.data.completedGuides}
                </div>
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
                <div className="font-bold text-2xl">
                  {stats.data.activeChallenges}
                </div>
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
                <div className="font-bold text-2xl">
                  {stats.data.participationPercentage}%
                </div>
              </CardContent>
            </Card>
          </div>
				</div>
				<div className="gap-6 grid grid-cols-1 lg:grid-cols-7">
					<Card className="col-span-1 lg:col-span-4">
						<CardHeader>
							<CardTitle>Actividad de Usuarios</CardTitle>
							<CardDescription>
								Nuevos usuarios vs. interacción diaria
							</CardDescription>
						</CardHeader>
						<CardContent className="pl-2">
							<div className="h-[300px] w-full">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={stats.data.userAcquisition}>
										<CartesianGrid strokeDasharray="3 3" vertical={false} />
										<XAxis
											dataKey="date"
											stroke="#888888"
											fontSize={12}
											tickLine={false}
											axisLine={false}
										/>
										<YAxis
											stroke="#888888"
											fontSize={12}
											tickLine={false}
											axisLine={false}
											tickFormatter={(value) => `${value}`}
										/>
										<Tooltip />
										<Legend />
										<Line
											type="monotone"
											dataKey="count"
											name="Nuevos Usuarios"
											stroke="#0d9488"
											strokeWidth={2}
											activeDot={{ r: 8 }}
										/>
									</LineChart>
								</ResponsiveContainer>
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
									{stats.data.popularGuides.map((guide, index) => (
										<div
											key={`participation-guide-${index.toString()}`}
											className="flex items-center"
										>
											<div className="flex justify-center items-center bg-teal-100 rounded-lg w-9 h-9 text-teal-600">
												<BookOpen className="w-5 h-5" />
											</div>
											<div className="space-y-1 ml-4">
												<p className="font-medium text-sm leading-none">
													{guide.name}
												</p>
												<p className="text-muted-foreground text-sm">
													{guide.completionPercentage}% completado
												</p>
											</div>
											<div className="ml-auto font-medium">
												{guide.userCount} usuarios
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
					<div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
						<Card className="lg:col-span-3">
							<CardHeader className="pb-3">
								<CardTitle>Impacto Educativo</CardTitle>
								<CardDescription>Métricas de aprendizaje global</CardDescription>
							</CardHeader>
							<CardContent>
									<div className="flex flex-col gap-8">
											<div className="flex flex-col gap-2">
														<div className="flex justify-between items-center">
															<span className="font-medium text-sm">Precisión Global</span>
															<span className="font-bold text-teal-600 text-xl">{stats.data.educationalImpact.globalAccuracy}%</span>
														</div>
														<div className="bg-gray-200 rounded-full h-3">
															<div
																	className="bg-teal-600 rounded-full h-3 transition-all duration-500"
																	style={{
																			width: `${stats.data.educationalImpact.globalAccuracy}%`,
																	}}
															></div>
													</div>
													<p className="text-muted-foreground text-xs text-right">Promedio de respuestas correctas</p>
											</div>
											<div className="flex items-center gap-4">
													<div className="bg-blue-100 p-3 rounded-full text-blue-600">
															<BookOpen className="size-6" />
													</div>
													<div className="flex flex-col">
															<span className="font-bold text-2xl">{stats.data.educationalImpact.totalQuestionsAnswered}</span>
															<span className="text-muted-foreground text-sm">Preguntas contestadas en total</span>
													</div>
											</div>
									</div>
							</CardContent>
						</Card>
					<Card className="lg:col-span-4">
						<CardHeader className="pb-3">
							<CardTitle>Distribución por Regiones</CardTitle>
							<CardDescription>Usuarios activos por región</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{stats.data.usersByRegion.map((regionStats, index) => (
									<div
										key={`region-${index.toString()}`}
										className="flex justify-between items-center"
									>
										<span className="text-sm">{regionStats.region}</span>
										<span className="font-bold text-sm">
											{regionStats.count}
										</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
					</div>
					<div className="gap-6 grid grid-cols-1 md:grid-cols-2">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle>Progreso de Retos</CardTitle>
							<CardDescription>Estado de los retos activos</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<span className="text-sm">Retos completados</span>
									<span className="font-medium text-sm">
										{stats.data.challengeProgress.completed}%
									</span>
								</div>
								<div className="bg-gray-200 rounded-full h-2">
									<div
										className="bg-teal-600 rounded-full h-2"
										style={{
											width: `${stats.data.challengeProgress.completed}%`,
										}}
									></div>
								</div>
								<div className="flex justify-between items-center mt-4">
									<span className="text-sm">Retos en progreso</span>
									<span className="font-medium text-sm">
										{stats.data.challengeProgress.inProgress}%
									</span>
								</div>
								<div className="bg-gray-200 rounded-full h-2">
									<div
										className="bg-blue-600 rounded-full h-2"
										style={{
											width: `${stats.data.challengeProgress.inProgress}%`,
										}}
									></div>
								</div>
								<div className="flex justify-between items-center mt-4">
									<span className="text-sm">Retos no iniciados</span>
									<span className="font-medium text-sm">
										{stats.data.challengeProgress.notStarted}%
									</span>
								</div>
								<div className="bg-gray-200 rounded-full h-2">
									<div
										className="bg-gray-400 rounded-full h-2"
										style={{
											width: `${stats.data.challengeProgress.notStarted}%`,
										}}
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
							<div className="flex justify-center items-center h-40">
								<div className="flex flex-col items-center">
									<Trophy className="mb-2 w-12 h-12 text-yellow-500" />
									<span className="font-bold text-3xl">
										{stats.data.badgesGranted}
									</span>
									<span className="text-muted-foreground text-sm">
										Total otorgadas
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</Main>
    </>
  );
}
