import { useState } from 'react';
import { LuLoader } from 'react-icons/lu';

import ServicesModal from '../modals/ServicesModal';
import EndShiftModal from '../modals/EndShiftModal';
import ShiftManagementModal from '../modals/ShiftManagementModal';

import { useShift } from './useShift';
import GreetingHeader from './GreetingHeader';
import StatsCards from './StatsCards';
import RegisterServiceButton from './RegisterServiceButton';
import ServicesList from './ServicesList';
import ServicesChart from './ServicesChart';

export default function Home({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEndShiftModalOpen, setIsEndShiftModalOpen] = useState(false);
  const [isShiftManagementOpen, setIsShiftManagementOpen] = useState(false);

  const {
    servicesList,
    shiftStatus,
    loading,
    initialLoading,
    elapsedTime,
    intervals,
    totalTurno,
    formatElapsedTime,
    handleStartShift,
    handlePauseShift,
    handleResumeShift,
    handleEndShift,
    handleSaveService,
  } = useShift(user?.id);

  if (initialLoading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto py-20 flex items-center justify-center">
        <LuLoader size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto py-8 px-6 flex flex-col gap-8">

      <GreetingHeader
        user={user}
        shiftStatus={shiftStatus}
        onOpenShiftManagement={() => setIsShiftManagementOpen(true)}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Columna Izquierda (2/3) */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          <StatsCards clientCount={servicesList.length} totalTurno={totalTurno} />

          <RegisterServiceButton
            shiftStatus={shiftStatus}
            onClick={() => setIsModalOpen(true)}
          />

          <ServicesList servicesList={servicesList} />
        </div>

        {/* Columna Derecha (1/3) */}
        <ServicesChart servicesList={servicesList} />

      </div>

      {/* ── Modales ── */}
      <ServicesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(service) => {
          handleSaveService(service);
          setIsModalOpen(false);
        }}
      />

      <EndShiftModal
        isOpen={isEndShiftModalOpen}
        onClose={() => setIsEndShiftModalOpen(false)}
        onConfirm={handleEndShift}
        servicesList={servicesList}
        totalTurno={totalTurno}
      />

      <ShiftManagementModal
        isOpen={isShiftManagementOpen}
        onClose={() => setIsShiftManagementOpen(false)}
        shiftStatus={shiftStatus}
        onStart={handleStartShift}
        onPause={handlePauseShift}
        onResume={handleResumeShift}
        onEnd={() => {
          setIsShiftManagementOpen(false);
          setIsEndShiftModalOpen(true);
        }}
        loading={loading}
        elapsedTime={elapsedTime}
        formatElapsedTime={formatElapsedTime}
        intervals={intervals}
      />

    </div>
  );
}
