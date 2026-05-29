import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import { JOURNEY_MODE_TASK_NAME, processJourneyModeLocation } from '@/services/journey-mode';

type JourneyModeTaskData = {
  locations?: Location.LocationObject[];
};

if (!TaskManager.isTaskDefined(JOURNEY_MODE_TASK_NAME)) {
  TaskManager.defineTask(JOURNEY_MODE_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error('[JourneyModeTask]', error.message);
      return;
    }

    const { locations } = (data ?? {}) as JourneyModeTaskData;
    const latestLocation = locations?.[locations.length - 1];
    if (!latestLocation) {
      return;
    }

    await processJourneyModeLocation(
      latestLocation.coords.latitude,
      latestLocation.coords.longitude
    ).catch((taskError) => {
      console.error('[JourneyModeTask]', taskError);
    });
  });
}
