import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { Tooltip } from '@/components/ui';
import { useAutoTheme } from '@/utils/hooks/useAutoTheme';
import { useAppSelector } from '@/store';
import { MODE_DARK } from '@/constants/theme.constant';

const HeaderActionsStart = () => {
  const { isAutoEnabled, shouldBeDarkMode } = useAutoTheme();
  const currentMode = useAppSelector((state) => state.theme.mode);
  const isDarkMode = currentMode === MODE_DARK;

  if (!isAutoEnabled) return null;

  return (
    <div className="flex items-center">
      <Tooltip 
        title={`Tema automático activo - ${shouldBeDarkMode ? 'Período nocturno' : 'Período diurno'}`}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            isDarkMode ? 'bg-blue-500' : 'bg-yellow-500'
          }`} />
          {isDarkMode ? (
            <HiOutlineMoon className="w-4 h-4 text-blue-500" />
          ) : (
            <HiOutlineSun className="w-4 h-4 text-yellow-500" />
          )}
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Auto
          </span>
        </div>
      </Tooltip>
    </div>
  );
};

export default HeaderActionsStart;
