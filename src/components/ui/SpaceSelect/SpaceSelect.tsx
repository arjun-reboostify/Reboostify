// hooks
import { useDataContext } from "../../../hooks/useDataContext";
// interfaces
import { Space } from "../../../interfaces";
import { ComponentPropsWithoutRef } from 'react';
// styles
import styles from './SpaceSelect.module.scss';
// assets
import unfold from '../../../assets/icons/unfold.svg';
// components
import { Fragment } from 'react';
import { Listbox, Transition } from "@headlessui/react";

interface SpaceSelectProps {
    space: Space | null;
    setSpace: React.Dispatch<React.SetStateAction<Space | null>>;
    className?: string;
}

// Omit the props that don't fit Listbox
type ListboxProps = Omit<ComponentPropsWithoutRef<typeof Listbox>, 'value' | 'defaultValue'>;

export const SpaceSelect = ({
    space,
    setSpace,
    className,
    ...props
}: SpaceSelectProps & ListboxProps) => {
    const { spaces } = useDataContext();

    return (
        <Listbox
            as='div'
            className={`${styles.spaceSelect} ${className}`}
            value={space}
            onChange={setSpace}
            {...props} // Ensure props are safe to spread
        >
            {space && (
                <>
                    <Listbox.Button
                        className={styles.selectButton}
                        aria-label='Click to open list of available spaces'
                    >
                        {space.name}
                        <img src={unfold} alt="Two arrows pointing up and down" />
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        enter={styles.transition}
                        enterFrom={styles.transitionEnterFrom}
                        enterTo={styles.transitionEnterTo}
                    >
                        <Listbox.Options>
                            {spaces?.map((spaceItem: Space) => (
                                <Listbox.Option key={spaceItem.id} value={spaceItem}>
                                    {({ active }) => (
                                        <li className={`${active ? styles.optionActive : ''}`}>
                                            {spaceItem.name}
                                        </li>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </>
            )}
        </Listbox>
    );
}
