import Clutter from 'gi://Clutter';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class PanelScrollExtension {
    enable() {
        this._scrollEventId = Main.panel.connect('scroll-event', this._onScroll.bind(this));
    }

    disable() {
        if (this._scrollEventId) {
            Main.panel.disconnect(this._scrollEventId);
            this._scrollEventId = null;
        }
    }

    _onScroll(actor, event) {
        const direction = event.get_scroll_direction();
        const workspaceManager = global.workspace_manager;
        const activeWorkspaceIndex = workspaceManager.get_active_workspace_index();
        const totalWorkspaces = workspaceManager.n_workspaces;

        let newIndex = activeWorkspaceIndex;

        if (direction === Clutter.ScrollDirection.UP) {
            newIndex = Math.max(0, activeWorkspaceIndex - 1);
        } else if (direction === Clutter.ScrollDirection.DOWN) {
            newIndex = Math.min(totalWorkspaces - 1, activeWorkspaceIndex + 1);
        }

        if (newIndex !== activeWorkspaceIndex) {
            const workspace = workspaceManager.get_workspace_by_index(newIndex);
            workspace.activate(global.get_current_time());
            return Clutter.EVENT_STOP; // Olayı devraldık, başka bir öğeye gitmesine gerek kalmadı
        }

        return Clutter.EVENT_PROPAGATE;
    }
}
