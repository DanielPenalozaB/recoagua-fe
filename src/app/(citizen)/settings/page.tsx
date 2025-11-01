import Profile from "@/components/citizen/profile/profile";

export default function ProfilePage() {
	return (
		<div className="container mx-auto py-8">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
					<p className="text-gray-600">
						Revisa tu progreso y logros en el sistema de recolección de agua
					</p>
				</div>
				<Profile />
			</div>
		</div>
	);
}
