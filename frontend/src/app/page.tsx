import TodoList from '@/components/todos/TodoList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Showcasify Todo App</h1>
          <p className="text-gray-600 mt-2">Manage your tasks with ease</p>
        </div>
        
        <TodoList />
      </div>
    </main>
  );
}
