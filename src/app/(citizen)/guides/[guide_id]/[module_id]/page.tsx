'use client';

import OptionsSelect from '@/components/citizen/modules/options-select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useModule } from '@/hooks/use-modules';
import { Module } from '@/types/module';
import { CornerUpLeft } from 'lucide-react';
import Link from 'next/link';
import { use, useState } from 'react';

export default function GuideModulePage({ params }: { params: Promise<{ module_id: string }> }) {
  const { module_id } = use(params);
  const { data, isLoading, error } = useModule(Number(module_id));
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);

  console.log(data, isLoading, error);

  if (isLoading) {
    return (
      <div className="mx-auto p-6 container">
        <Skeleton className='flex justify-between items-center gap-4 bg-neutral-200 p-4 rounded-xl h-20'>
          <div className='flex items-center gap-4 text-white'>
            <Skeleton className='size-10' />
            <div className='flex flex-col'>
              <Skeleton className='bg-neutral-100 w-32 h-8' />
              <Skeleton className='bg-neutral-100 w-24 h-6' />
            </div>
          </div>
          <Skeleton className='w-12 h-9' />
        </Skeleton>
        <div className="space-y-4 mt-6">
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-3/4 h-6" />
          <div className="space-y-3 mt-8">
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="font-bold text-red-600 text-2xl">Error</h2>
          <p className="text-gray-600">No se pudo cargar el módulo</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="font-bold text-gray-600 text-2xl">Módulo no encontrado</h2>
        </div>
      </div>
    );
  }


  const handleAnswerSubmit = async (selectedOptions: number[]) => {
    // Here you would typically send the answer to your backend
    console.log('Selected options:', selectedOptions);

    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  const handleNextBlock = () => {
    if (data && currentBlockIndex < data.data.blocks.length - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
    }
  };

  const handlePrevBlock = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(currentBlockIndex - 1);
    }
  };

  const moduleData: Module = data.data;
  const currentBlock = moduleData.blocks[currentBlockIndex];

  return (
    <div className="mx-auto p-6 container">
      <div className='flex justify-between items-center gap-4 bg-white mb-6 p-4 border-2 border-neutral-200 rounded-xl'>
        <div className='flex items-center gap-4 text-neutral-600'>
          <Link
            title='Regresar a las guías'
            href={`/guides/${data.data.guide.id}`}
            className='flex justify-center items-center hover:bg-neutral-300/50 rounded-md size-10 text-neutral-400'
          >
            <CornerUpLeft className='size-4' />
          </Link>
          <div className='flex items-center gap-1'>
            <h1 className='w-full font-bold text-2xl whitespace-nowrap'>{data.data.name}</h1>
          </div>
        </div>
        <div className='flex justify-center items-center gap-1 border-2 border-neutral-200 rounded-lg min-w-10 size-10 font-semibold text-neutral-500'>
          <span className='text-teal-500'>{currentBlockIndex + 1}</span>/<span>{data.data.blocks.length}</span>
        </div>
      </div>

      <div className=''>
        <div className='mb-6'>
          <h2 className='mb-2 font-bold text-neutral-800 text-xl'>{currentBlock.statement}</h2>
        </div>
        <OptionsSelect
          options={currentBlock.answers}
          questionType={currentBlock.questionType}
          onSubmit={handleAnswerSubmit}
        />
      </div>
      {/* Navigation between blocks (simplified) */}
      {moduleData.blocks.length > 1 && (
      <div className='flex justify-between'>
        <Button
          onClick={handlePrevBlock}
          disabled={currentBlockIndex === 0}
          variant="outline"
          className="disabled:opacity-50"
        >
          Anterior
        </Button>
        <Button
          onClick={handleNextBlock}
          disabled={currentBlockIndex === data.data.blocks.length - 1}
          variant="outline"
          className="disabled:opacity-50"
        >
          Siguiente
        </Button>
      </div>
      )}
    </div>
  );
}