import React from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from '@material-ui/core';
import { Course } from '../../app/data';
import { DestinationData } from './hooks/selectableCourseDialog';

/**
 * Component properties for a AddCourseDialog.
 */
interface AddCourseDialogProps {
  /**
   * A collection of valid courses to add.
   */
  courses: Course[];

  /**
   * A title for the destination to where courses will be added.
   */
  destination: DestinationData | null;

  /**
   * If true, multiple course selections will be allowed.
   */
  allowMultiple: boolean;

  /**
   * True if the dialog is currently open.
   */
  open: boolean;

  /**
   * A callback triggered when the dialog closes without selection.
   */
  onCancelled: () => void;

  /**
   * A callback notified when course selections are finalized.
   */
  onCoursesSelected: (courseIds: string[], destinationId: string) => void;
}

/**
 * A dialog that allows for the selection of courses.
 *
 * The useSelectableCourseDialog hook should be used to easily interface with
 * this component.
 */
export default function AddCourseDialog({
  courses,
  destination,
  allowMultiple,
  open,
  onCancelled,
  onCoursesSelected,
}: AddCourseDialogProps): JSX.Element {
  const destinationName = destination ? destination.name : '';
  const destinationText = `Add course${allowMultiple ? 's' : ''} to ${destinationName}`;

  const [selectionMap, setSelectionMap] = React.useState<{ [key: string]: boolean }>({});

  const [selectedCount, setSelectedCount] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = event.currentTarget;
    const newCount = checked ? selectedCount + 1 : selectedCount - 1;
    setSelectedCount(newCount);
    setSelectionMap({
      ...selectionMap,
      [name]: checked,
    });
  };

  const isDone = selectedCount > 0;

  const handleOnClose = () => {
    if (!isDone) {
      onCancelled();
      return;
    }
    // TODO: Fix obvious code smell
    const items = Object.keys(selectionMap);
    onCoursesSelected(items, destination?.destinationId ?? '');
    setSelectedCount(0);
    setSelectionMap({});
  };

  const courseItems = courses.map((course) => {
    const itemLabel = `${course.catalogCode}: ${course.title}`;
    return (
      <FormControlLabel
        key={course.id}
        control={<Checkbox onChange={handleChange} name={course.id} />}
        label={itemLabel}
      />
    );
  });

  // const classes = useStyles();

  return (
    <Dialog open={open} onClose={handleOnClose} aria-labelledby={destinationText}>
      <DialogTitle id="addCourseDialogTitle">{destinationText}</DialogTitle>
      <div className={classes.selectCoursesGroup}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Select courses</FormLabel>
          <FormGroup>{courseItems}</FormGroup>
          <FormHelperText>Choose as many as you want.</FormHelperText>
        </FormControl>
      </div>
      <div className={classes.buttonGroup}>
        <Button onClick={handleOnClose}>Cancel</Button>
        <Button color="primary" disabled={!isDone} onClick={handleOnClose}>
          Add
        </Button>
      </div>
    </Dialog>
  );
}
